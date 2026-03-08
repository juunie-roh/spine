import type TSParser from "tree-sitter";

import { Capture } from "@/models";

import { getClasses } from "./class";
import { getFunctions } from "./function";
import { getImports } from "./import";

function capture(node: TSParser.SyntaxNode, parentId: string): Capture.Result {
  return {
    imports: getImports(node, parentId) ?? [],
    functions: getFunctions(node, parentId) ?? [],
    classes: getClasses(node, parentId) ?? [],
  };
}

export { capture };
