import { createCanonicalId } from "@juun-roh/spine/utils";
import type TSParser from "tree-sitter";

import { Capture } from "@/models";

import { capture } from "./capture";
import { query } from "./query";
import { createGetter, getMatches, getNode } from "./utils";

function getClassBody(node: TSParser.SyntaxNode, parentId: string) {
  const methodMatches = getMatches(query.get("method"), node);
  const memberMatches = getMatches(query.get("member"), node);

  const methods = methodMatches.map((match) => {
    const get = createGetter<"method">(match);

    const name = get("name").text;
    const id = createCanonicalId(parentId, name);

    return {
      id,
      node: get("method"),
      body: capture(get("body"), id),
      name,
      modifier: get("modifier")?.text ?? "public",
      is_static: get("is_static") !== undefined,
      type_params: get("type_params")?.namedChildren.map((c) => c.text) ?? [],
      params: get("params").namedChildren.map((c) => c.text) ?? [],
      return_type: get("return_type")?.text,
    } satisfies Capture<"method">;
  });

  const members = memberMatches.map((match) => {
    const get = createGetter<"member">(match);

    const name = get("name").text;

    return {
      id: createCanonicalId(parentId, name),
      node: get("member"),
      name,
      modifier: get("modifier")?.text,
      is_static: get("is_static") !== undefined,
      type: get("type")?.text,
    } satisfies Capture<"member">;
  });

  return { methods, members };
}

function getClasses(
  node: TSParser.SyntaxNode,
  parentId: string,
): Capture<"class">[] {
  const matches = getMatches(query.get("class"), node);

  return matches.map((match) => {
    const get = (name: string) => getNode(name, match);

    const name = get("name")!.text;
    const id = createCanonicalId(parentId, name);
    const heritage = get("heritage");

    return {
      id,
      node: (get("class") ?? get("abstract_class"))!,
      body: getClassBody(get("body")!, id)!,
      name,

      type_params: get("type_params")?.namedChildren.map((c) => c.text) ?? [],
      implements:
        heritage?.namedChildren
          ?.find((f) => f.type === "implements_clause")
          ?.namedChildren.map((c) => c.text) ?? [],
      extends:
        heritage?.namedChildren
          ?.find((f) => f.type === "extends_clause")
          ?.namedChildren.map((c) => c.text) ?? [],
    } satisfies Capture<"class">;
  });
}

export { getClassBody, getClasses };
