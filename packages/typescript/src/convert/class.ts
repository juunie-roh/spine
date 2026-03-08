import type { Capture, Edge, Node } from "@/models";

import { convert } from "./convert";

function convertClassBody(
  body: Capture.ClassBody,
  parentId: string,
): { edges: Edge[]; nodes: Node[] } {
  const edges: Edge[] = [];
  const nodes: Node[] = [];

  for (const method of body.methods) {
    edges.push({
      from: parentId,
      to: method.id,
      kind: "defines",
      resolved: true,
    } satisfies Edge);

    nodes.push({
      id: method.id,
      kind: "method",
      range: {
        startIndex: method.node.startIndex,
        endIndex: method.node.endIndex,
        startPosition: method.node.startPosition,
        endPosition: method.node.endPosition,
      },
      props: {
        name: method.name,
        modifier: method.modifier,
        is_static: method.is_static,
        type_params: method.type_params,
        params: method.params,
        return_type: method.return_type,
      },
    } satisfies Node);

    if (method.body) {
      const nested = convert(method.body, method.id);
      edges.push(...nested.edges);
      nodes.push(...nested.nodes);
    }
  }

  for (const field of body.fields) {
    edges.push({
      from: parentId,
      to: field.id,
      kind: "defines",
      resolved: true,
    } satisfies Edge);

    nodes.push({
      id: field.id,
      kind: "field",
      range: {
        startIndex: field.node.startIndex,
        endIndex: field.node.endIndex,
        startPosition: field.node.startPosition,
        endPosition: field.node.endPosition,
      },
      props: {
        name: field.name,
        modifier: field.modifier,
        is_static: field.is_static,
        type: field.type,
        value: field.value,
      },
    } satisfies Node);
  }

  return { edges, nodes };
}

function convertClasses(
  classes: Capture.Class[],
  parentId: string,
): {
  edges: Edge[];
  nodes: Node[];
} {
  const edges: Edge[] = [];
  const nodes: Node[] = [];

  for (const cls of classes) {
    edges.push({
      from: parentId,
      to: cls.id,
      kind: "defines",
      resolved: true,
    } satisfies Edge);

    nodes.push({
      id: cls.id,
      kind: "class",
      range: {
        startIndex: cls.node.startIndex,
        endIndex: cls.node.endIndex,
        startPosition: cls.node.startPosition,
        endPosition: cls.node.endPosition,
      },
      props: {
        name: cls.name,
        type_params: cls.type_params,
        extends: cls.extends,
        implements: cls.implements,
      },
    } satisfies Node);

    if (cls.body) {
      const nested = convertClassBody(cls.body, cls.id);
      edges.push(...nested.edges);
      nodes.push(...nested.nodes);
    }
  }

  return { edges, nodes };
}

export { convertClassBody, convertClasses };
