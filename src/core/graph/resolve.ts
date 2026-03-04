import { Edge } from "@/models";

import { GraphError } from "./error";
import { Graph } from "./graph";
import type { NodeID, ResolvedEdge } from "./types";
import { isEdge } from "./types";

function parent(id: NodeID): NodeID | undefined {
  const i = id.lastIndexOf(":");
  return i > 0 ? id.slice(0, i) : undefined;
}

/**
 *
 */
function resolve(graph: Graph, edge: Edge): ResolvedEdge;
/**
 *
 */
function resolve(graph: Graph, name: string, from: NodeID): NodeID;
function resolve(
  graph: Graph,
  item: Edge | string,
  from?: NodeID,
): ResolvedEdge | NodeID {
  if (isEdge(item)) {
    // item is Edge
    if (item.resolved) return item as ResolvedEdge;

    return {
      ...item,
      to: resolve(graph, item.to, item.from),
      resolved: true,
    } satisfies ResolvedEdge;
  } else {
    // resolve id by name
    const name = item;
    let scope = from; // start from caller

    while (scope !== undefined) {
      const adj = graph.adjacent(scope);
      if (adj) {
        for (const [targetId] of adj) {
          if (targetId.endsWith(":" + name)) {
            return targetId;
          }
        }
      }

      scope = parent(scope);
    }

    throw new GraphError(
      "GRAPH_EDGE_RESOLUTION_FAILED",
      `Failed to resolve ${item} from ${from}`,
    );
  }
}

export { resolve };
