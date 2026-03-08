import type TSParser from "tree-sitter";

import { Capture } from "@/models";
import { query } from "@/queries";

import { capture } from "./capture";
import { getMatches, getNode, groupMatches } from "./utils";

function getClassBody(
  node: TSParser.SyntaxNode,
  parentId: string,
): Capture.ClassBody | undefined {
  const matches = getMatches(query.get("class_body"), node);

  const methods = groupMatches("method", matches).map((match) => {
    const get = (name: string) => getNode(name, match);
    const name = get("name")!.text;

    const id = `${parentId}:${name}`;

    return {
      id,
      node: get("method")!,
      body: capture(get("body")!, id),
      name,
      modifier: get("modifier")?.text,
      is_static: get("is_static") !== undefined,
      type_params: get("type_params")?.namedChildren.map((c) => c.text) ?? [],
      params: get("params")?.namedChildren.map((c) => c.text) ?? [],
      return_type: get("return_type")?.text,
    } satisfies Capture.Method;
  });

  const fields = groupMatches("field", matches).map((match) => {
    const get = (name: string) => getNode(name, match);
    const name = get("name")!.text;

    return {
      id: `${parentId}:${name}`,
      node: get("field")!,
      name,
      modifier: get("modifier")?.text,
      is_static: get("is_static") !== undefined,
      type: get("type")?.text,
      value: get("value")?.text,
    } satisfies Capture.Field;
  });

  return { methods, fields };
}

function getClasses(
  node: TSParser.SyntaxNode,
  parentId: string,
): Capture.Class[] | undefined {
  const matches = getMatches(query.get("class"), node);

  return matches.map((match) => {
    const get = (name: string) => getNode(name, match);

    const name = get("name")!.text;
    const id = `${parentId}:${name}`;
    const heritage = get("heritage");

    return {
      id,
      node: get("class")!,
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
    } satisfies Capture.Class;
  });
}

export { getClassBody, getClasses };
