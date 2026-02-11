import { Parser } from "web-tree-sitter";

const g = globalThis as unknown as { __parser?: Parser };

export async function initParser(): Promise<Parser> {
  await Parser.init();
  g.__parser = new Parser();
  return g.__parser;
}

export function getParser(): Parser {
  if (!g.__parser) {
    throw new Error("Parser not initialized. Call initParser() first.");
  }
  return g.__parser;
}
