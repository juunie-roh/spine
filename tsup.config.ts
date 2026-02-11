import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entry: [
      "src/index.ts",
      "src/bin/index.ts",
      "src/core/index.ts",
      "src/typescript/index.ts",
    ],
    format: "cjs",
    minify: true,
    target: ["node22", "node24", "node25"],
    external: ["tree-sitter-typescript"],
    sourcemap: true,
  },
]);
