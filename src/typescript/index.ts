import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { Language } from "web-tree-sitter";

import { getParser } from "@/core/parser";

export default async function parse(file: string) {
  const parser = getParser();
  const target = file.endsWith(".ts")
    ? "tree-sitter-typescript.wasm"
    : "tree-sitter-tsx.wasm";

  const wasmPath = resolve(
    dirname(require.resolve("tree-sitter-typescript/package.json")),
    target,
  );

  const typescript = await Language.load(wasmPath);
  parser.setLanguage(typescript);

  const source = readFileSync(file, "utf-8");
  return parser.parse(source);
}
