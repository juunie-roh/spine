import { createCanonicalId } from "@juun-roh/spine/utils";

import type { Capture, Edge, Node } from "@/models";

function convertImports(
  captures: Capture<"import">[],
  parentId: string,
): {
  edges: Edge[];
  nodes: Node[];
} {
  const edges: Edge[] = [];
  const nodes: Node[] = [];
  const sources = new Set<string>();

  for (const captured of captures) {
    const { source, name, type, alias } = captured;
    if (!sources.has(source as string)) {
      sources.add(source as string);
    }

    const representative = alias ? alias : name;

    if (representative) {
      // defines
      const defId = createCanonicalId(parentId, representative as string);
      edges.push({
        from: parentId,
        to: defId,
        kind: "defines",
        resolved: true,
      } satisfies Edge);

      nodes.push({
        id: defId,
        kind: "variable",
        props: alias
          ? {
              alias_of: name,
              source,
            }
          : undefined,
      } satisfies Node);
    }

    // import relationship
    edges.push({
      from: parentId,
      to: source as string,
      kind: "imports",
      resolved: true,
      props: type
        ? {
            type,
          }
        : undefined,
    } satisfies Edge);
  }

  // deduplicated source nodes
  sources.forEach((source) => {
    nodes.push({
      id: source,
      kind: "module",
    } satisfies Node);
  });

  return { edges, nodes };
}

export { convertImports };
