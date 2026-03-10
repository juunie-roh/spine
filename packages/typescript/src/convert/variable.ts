import type { Capture, Edge, Node } from "@/models";

function convertVariables(
  variables: Capture<"variable">[],
  parentId: string,
): { edges: Edge[]; nodes: Node[] } {
  const edges: Edge[] = [];
  const nodes: Node[] = [];

  for (const v of variables) {
    edges.push({
      from: parentId,
      to: v.id,
      kind: "defines",
      resolved: true,
    } satisfies Edge);

    nodes.push({
      id: v.id,
      kind: "variable",
      range: {
        startIndex: v.node.startIndex,
        endIndex: v.node.endIndex,
        startPosition: v.node.startPosition,
        endPosition: v.node.endPosition,
      },
      props: {
        name: v.name,
        kind: v.kind,
      },
    } satisfies Node);
  }

  return { edges, nodes };
}

export { convertVariables };
