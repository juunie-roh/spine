import { readFileSync } from "node:fs";

import TypeScript from "tree-sitter-typescript";

import { parser } from "@/core/parser";

export default async function parse(file: string) {
  const target = file.endsWith(".ts") ? TypeScript.typescript : TypeScript.tsx;

  parser.setLanguage(target as any);

  const source = readFileSync(file, "utf-8");
  return parser.parse(source);
}
