import type { Capture, CaptureResult, Edge, Node } from "@/models";

import { convert } from "./convert";

function convertClassBody(
  body: { methods: Capture<"method">[]; members: Capture<"member">[] },
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
      const nested = convert(method.body as CaptureResult, method.id);
      edges.push(...nested.edges);
      nodes.push(...nested.nodes);
    }
  }

  for (const member of body.members) {
    edges.push({
      from: parentId,
      to: member.id,
      kind: "defines",
      resolved: true,
    } satisfies Edge);

    nodes.push({
      id: member.id,
      kind: "member",
      range: {
        startIndex: member.node.startIndex,
        endIndex: member.node.endIndex,
        startPosition: member.node.startPosition,
        endPosition: member.node.endPosition,
      },
      props: {
        name: member.name,
        modifier: member.modifier,
        is_static: member.is_static,
        type: member.type,
      },
    } satisfies Node);
  }

  return { edges, nodes };
}

function convertClasses(
  classes: Capture<"class">[],
  parentId: string,
): {
  edges: Edge[];
  nodes: Node[];
} {
  const edges: Edge[] = [];
  const nodes: Node[] = [];

  if (classes.length > 0) {
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
        const nested = convertClassBody(
          cls.body as {
            methods: Capture<"method">[];
            members: Capture<"member">[];
          },
          cls.id,
        );
        edges.push(...nested.edges);
        nodes.push(...nested.nodes);
      }
    }
  }

  return { edges, nodes };
}

export { convertClassBody, convertClasses };
