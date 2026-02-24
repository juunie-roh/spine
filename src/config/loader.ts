import path, { join } from "node:path";
import { cwd } from "node:process";

import { ConfigError } from "./error";
import { Config } from "./types";

/**
 * Asserts that the given configuration file path is valid.
 * @param configPath The configuration file path to check.
 * @throws If `configPath` is not a non-empty string.
 */
function assertConfigPath(configPath: string): asserts configPath is string {
  if (!configPath || typeof configPath !== "string") {
    throw new ConfigError("'configPath' must be a non-empty string");
  }
}

function resolveConfigPath(configPath: string): string {
  assertConfigPath(configPath);
  return path.resolve(join(cwd(), configPath));
}

function assertConfig(config: unknown): asserts config is Config {
  if (!config || typeof config !== "object") {
    throw new ConfigError("Config must be an object");
  }

  const { plugin } = config as Record<string, unknown>;

  if (!Array.isArray(plugin) || plugin.length === 0) {
    throw new ConfigError("Config 'plugin' must be a non-empty array");
  }

  for (const entry of plugin) {
    if (!entry || typeof entry !== "object") {
      throw new ConfigError("Each plugin entry must be an object");
    }
    const { ext, name } = entry as Record<string, unknown>;
    if (typeof ext !== "string" || !ext) {
      throw new ConfigError(
        "Each plugin entry must have a non-empty 'ext' string",
      );
    }
    if (typeof name !== "string" || !name) {
      throw new ConfigError(
        "Each plugin entry must have a non-empty 'name' string",
      );
    }
  }
}

function loadConfig(configPath: string): Config {
  const resolved = resolveConfigPath(configPath);
  const config = require(resolved);
  assertConfig(config);
  return config;
}

export { loadConfig };
