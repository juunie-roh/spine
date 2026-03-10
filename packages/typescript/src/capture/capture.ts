import type TSParser from "tree-sitter";

import { CaptureResult } from "@/models";

import { getClasses } from "./class";
import { getFunctions } from "./function";
import { getImports } from "./import";
import { getVariables } from "./variable";

function capture(node: TSParser.SyntaxNode, parentId: string): CaptureResult {
  return {
    import: getImports(node, parentId) ?? [],
    function: getFunctions(node, parentId) ?? [],
    class: getClasses(node, parentId) ?? [],
    member: [],
    method: [],
    params: [],
    variable: getVariables(node, parentId) ?? [],
  };
}

export { capture };
