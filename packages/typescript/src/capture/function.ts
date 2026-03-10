import { createCanonicalId } from "@juun-roh/spine/utils";
import type TSParser from "tree-sitter";

import { Capture } from "@/models";

import { capture } from "./capture";
import { query } from "./query";
import { createGetter, getMatches } from "./utils";

function getFunctions(
  node: TSParser.SyntaxNode,
  parentId: string,
): Capture<"function">[] {
  const matches = getMatches(query.get("function"), node);

  return matches.map((match) => {
    const get = createGetter<"function">(match);

    const name = get("name").text;
    const id = createCanonicalId(parentId, name);

    return {
      id,
      node: get("function"),
      body: capture(get("body"), id),
      name,

      type_params: get("type_params")?.namedChildren.map((c) => c.text) ?? [],
      params: get("params")?.namedChildren.map((c) => c.text) ?? [],
      return_type: get("return_type")?.text,
    } satisfies Capture<"function">;
  });
}

export { getFunctions };
