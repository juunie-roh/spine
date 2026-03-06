/* eslint-disable unused-imports/no-unused-imports */

import { EventEmitter } from "node:events";
import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";
import type { Readable } from "node:stream";

// ─── Type Aliases & Interfaces ───

type Severity = "info" | "warn" | "error";

interface LogEntry {
  timestamp: number;
  severity: Severity;
  message: string;
  context?: Record<string, unknown>;
}

interface Transport {
  write(entry: LogEntry): void | Promise<void>;
}

// ─── Standalone Functions ───

function createTimestamp(): number {
  return Date.now();
}

function formatEntry(entry: LogEntry): string {
  const tag = `[${entry.severity.toUpperCase()}]`;
  const time = new Date(entry.timestamp).toISOString();
  return `${time} ${tag} ${entry.message}`;
}

const severityWeight = (severity: Severity): number => {
  const weights: Record<Severity, number> = { info: 0, warn: 1, error: 2 };
  return weights[severity];
};

function shouldLog(entry: LogEntry, minSeverity: Severity): boolean {
  return severityWeight(entry.severity) >= severityWeight(minSeverity);
}

// ─── Transport Implementations ───

class ConsoleTransport implements Transport {
  private prefix: string;

  constructor(prefix: string = "") {
    this.prefix = prefix;
  }

  write(entry: LogEntry): void {
    const formatted = formatEntry(entry);
    const line = this.prefix ? `${this.prefix} ${formatted}` : formatted;

    if (entry.severity === "error") {
      console.error(line);
    } else {
      console.log(line);
    }
  }
}

class FileTransport implements Transport {
  private filePath: string;
  private buffer: string[] = [];
  private flushInterval: number;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(filePath: string, flushInterval: number = 5000) {
    this.filePath = path.resolve(filePath);
    this.flushInterval = flushInterval;
    this.startAutoFlush();
  }

  write(entry: LogEntry): void {
    this.buffer.push(formatEntry(entry));
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const lines = this.buffer.join("\n") + "\n";
    this.buffer = [];

    const existing = await readFile(this.filePath, "utf-8").catch(() => "");
    await writeFile(this.filePath, existing + lines, "utf-8");
  }

  private startAutoFlush(): void {
    this.timer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.flush();
  }
}

// ─── Logger ───

class Logger extends EventEmitter {
  private transports: Transport[];
  private minSeverity: Severity;
  private context: Record<string, unknown>;

  constructor(
    transports: Transport[],
    minSeverity: Severity = "info",
    context: Record<string, unknown> = {},
  ) {
    super();
    this.transports = transports;
    this.minSeverity = minSeverity;
    this.context = context;
  }

  private createEntry(severity: Severity, message: string): LogEntry {
    return {
      timestamp: createTimestamp(),
      severity,
      message,
      context: Object.keys(this.context).length > 0 ? this.context : undefined,
    };
  }

  private dispatch(entry: LogEntry): void {
    if (!shouldLog(entry, this.minSeverity)) return;

    for (const transport of this.transports) {
      transport.write(entry);
    }

    this.emit("logged", entry);
  }

  info(message: string): void {
    this.dispatch(this.createEntry("info", message));
  }

  warn(message: string): void {
    this.dispatch(this.createEntry("warn", message));
  }

  error(message: string): void {
    this.dispatch(this.createEntry("error", message));
  }

  child(additionalContext: Record<string, unknown>): Logger {
    return new Logger(this.transports, this.minSeverity, {
      ...this.context,
      ...additionalContext,
    });
  }
}

// ─── Factory ───

function createLogger(options: {
  transports?: Transport[];
  minSeverity?: Severity;
  file?: string;
}): Logger {
  const transports: Transport[] = options.transports ?? [
    new ConsoleTransport(),
  ];

  if (options.file) {
    transports.push(new FileTransport(options.file));
  }

  return new Logger(transports, options.minSeverity);
}

// ─── Generic Utilities ───

function retry<T>(fn: () => Promise<T>, attempts: number): Promise<T> {
  return fn().catch((err) => {
    if (attempts <= 1) throw err;
    return retry(fn, attempts - 1);
  });
}

async function withLogging<T>(
  logger: Logger,
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  logger.info(`Starting: ${label}`);
  try {
    const result = await fn();
    logger.info(`Completed: ${label}`);
    return result;
  } catch (err) {
    logger.error(`Failed: ${label} — ${String(err)}`);
    throw err;
  }
}

// ─── Usage ───

const logger = createLogger({ minSeverity: "warn", file: "app.log" });
const childLogger = logger.child({ module: "auth" });

childLogger.info("This will be filtered out");
childLogger.warn("Token expires soon");
childLogger.error("Authentication failed");

export {
  ConsoleTransport,
  createLogger,
  FileTransport,
  formatEntry,
  Logger,
  retry,
  shouldLog,
  withLogging,
};
export type { LogEntry, Severity, Transport };
