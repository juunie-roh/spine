import type TSParser from "tree-sitter";

import { Capture } from "@/models";

import { query } from "./query";
import { createGetter, getMatches, groupMatches } from "./utils";

function parseType(node?: TSParser.SyntaxNode): Capture<"import">["type"] {
  if (!node || !node.parent) return;

  switch (node.parent.type) {
    case "import_clause":
      return "default";
    case "import_specifier":
      return "named";
    case "namespace_import":
      return "namespace";
    default:
      return undefined;
  }
}

function getImports(
  node: TSParser.SyntaxNode,
  parentId: string,
): Capture<"import">[] {
  const matches = getMatches(query.get("import"), node);

  return groupMatches("import", matches).map((match) => {
    const get = createGetter<"import">(match);

    return {
      id: parentId,
      node: get("import"),
      name: get("name").text,
      alias: get("alias")?.text,
      type: parseType(get("name")),
      source: get("source").text,
    } satisfies Capture<"import">;
  });
}

export { getImports };
