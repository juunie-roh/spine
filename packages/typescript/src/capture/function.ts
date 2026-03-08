import type TSParser from "tree-sitter";

import { Capture } from "@/models";
import { query } from "@/queries";

import { capture } from "./capture";
import { getMatches, getNode } from "./utils";

function getFunctions(
  node: TSParser.SyntaxNode,
  parentId: string,
): Capture.Function[] | undefined {
  const matches = getMatches(query.get("function"), node);

  return matches.map((match) => {
    const get = (name: string) => getNode(name, match);

    const name = get("name")!.text;
    const id = `${parentId}:${name}`;

    return {
      id,
      node: get("function")!,
      body: capture(get("body")!, id),
      name,

      type_params: get("type_params")?.namedChildren.map((c) => c.text) ?? [],
      params: get("params")?.namedChildren.map((c) => c.text) ?? [],
      return_type: get("return_type")?.text,
    } satisfies Capture.Function;
  });
}

export { getFunctions };
