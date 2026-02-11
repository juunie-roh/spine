import Parser from "tree-sitter";

import { query } from "./parser";

export function print(tree?: Parser.Tree) {
  if (tree) {
    const root = tree.rootNode;
    console.log(root);
    query(
      root,
      `
  (function_declaration
    name: (identifier) @func.name) @func.decl
`,
    ).forEach((result) => console.log(result));
  }
}
