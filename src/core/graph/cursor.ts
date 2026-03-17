import type { Edge, Node, NodeId } from "@/models";

import type Graph from "./graph";

/**
 * A lightweight mutable cursor instance.
 */
class GraphCursor<N extends Node = Node, E extends Edge = Edge> {
  private readonly _graph: Graph<N, E>;
  private _id: NodeId;

  constructor(graph: Graph<N, E>, id: NodeId) {
    this._graph = graph;
    this._id = id;
  }

  // IDE sync entry point
  static atPosition<N extends Node = Node, E extends Edge = Edge>(
    graph: Graph<N, E>,
    offset: number,
  ): GraphCursor<N, E> | undefined {
    let deepestId: NodeId | undefined;
    let deepestDepth = -1;

    for (const [id, node] of graph.nodes) {
      const { startIndex, endIndex } = node.range ?? {};
      if (startIndex === undefined || endIndex === undefined) continue;
      if (offset < startIndex || offset > endIndex) continue;

      // path length is scope depth — longer path = deeper node
      const depth = graph.depth(id);
      if (depth > deepestDepth) {
        deepestDepth = depth;
        deepestId = id;
      }
    }

    return deepestId ? new GraphCursor(graph, deepestId) : undefined;
  }

  get node(): ReturnType<Graph["nodes"]["get"]> {
    return this._graph.nodes.get(this._id);
  }

  get depth(): number {
    return this._graph.depth(this._id);
  }

  get parent(): ReturnType<Graph["nodes"]["get"]> {
    const parentId = this._graph.parent(this._id);
    return parentId ? this._graph.nodes.get(parentId) : undefined;
  }

  get children(): ReturnType<Graph["adjacent"]> {
    return this._graph.adjacent(this._id);
  }

  move(to: NodeId): this {
    this._id = to;
    return this;
  }

  fork(): GraphCursor<N, E> {
    return new GraphCursor(this._graph, this._id);
  }
}

export default GraphCursor;
