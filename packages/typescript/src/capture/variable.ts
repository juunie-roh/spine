import { createCanonicalId } from "@juun-roh/spine/utils";
import type TSParser from "tree-sitter";

import { Capture } from "@/models";

import { query } from "./query";
import { getNode } from "./utils";

function getVariables(
  node: TSParser.SyntaxNode,
  parentId: string,
): Capture<"variable">[] {
  const matches = query.match("variable", node, ["export_statement"]);

  const excludes = new Set([
    "arrow_function",
    "function_expression",
    "generator_function",
    "class",
  ]);

  return matches.flatMap((match) => {
    const varNode = match.captures.find((c) => c.name === "variable")?.node;
    if (!varNode) return [];

    const declarator = varNode.namedChildren.find(
      (c) => c.type === "variable_declarator",
    );

    if (
      declarator?.childForFieldName("value")?.type &&
      excludes.has(declarator.childForFieldName("value")!.type)
    ) {
      return [];
    }

    const kind = getNode("kind", match)!.text;
    const names = match.captures
      .filter((c) => c.name === "name")
      .map((c) => c.node.text);

    return names.map(
      (name) =>
        ({
          id: createCanonicalId(parentId, name),
          node: varNode,
          kind,
          name,
        }) satisfies Capture<"variable">,
    );
  });
}

export { getVariables };
