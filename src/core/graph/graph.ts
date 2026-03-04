import type { Edge, Node } from "@/models";
import { defined } from "@/shared/defined";

import { GraphError } from "./error";
import { resolve } from "./resolve";
import type { EdgeKind, EdgeProps, NodeID, ResolvedEdge } from "./types";

class Graph {
  private _nodes: Map<NodeID, Node>;
  private _edges: Map<NodeID, Map<NodeID, Set<EdgeKind>>>;
  private _edgeProps: Map<NodeID, Map<NodeID, Map<EdgeKind, EdgeProps>>>;

  private constructor() {
    this._nodes = new Map();
    this._edges = new Map();
    this._edgeProps = new Map();
  }

  /**
   * Contains all the nodes added to the graph.
   */
  get nodes(): ReadonlyMap<NodeID, Node> {
    return this._nodes;
  }
  /**
   * The adjacency list of the graph.
   */
  get edges(): ReadonlyMap<NodeID, ReadonlyMap<NodeID, ReadonlySet<EdgeKind>>> {
    return this._edges;
  }
  /**
   * Language specific metadata for each edges.
   */
  get edgeProps(): ReadonlyMap<
    NodeID,
    ReadonlyMap<NodeID, ReadonlyMap<EdgeKind, EdgeProps>>
  > {
    return this._edgeProps;
  }

  static build(nodes: Node[], edges: Edge[]): Graph {
    const graph = new Graph();

    for (const node of nodes) {
      graph.addNode(node);
    }

    // adds pre-resolved edges first (definitions, imports, ...)
    for (const edge of edges.filter((e) => e.resolved === true)) {
      graph.addEdge(edge);
    }

    // resolve edges by walking through pre-resolved edges
    for (const edge of edges.filter((e) => e.resolved !== true)) {
      graph.addEdge(resolve(graph, edge));
    }

    return graph;
  }

  /**
   * Adds a node to the graph.
   */
  addNode(node: Node): this {
    if (!this._nodes.has(node.id)) {
      this._nodes.set(node.id, node);
    }

    if (!this._edges.has(node.id)) {
      this._edges.set(node.id, new Map());
    }
    return this;
  }

  /**
   * Removes a node from the graph.
   */
  removeNode(node: Node): this {
    this._edges.delete(node.id);
    this._nodes.delete(node.id);
    this._edgeProps.delete(node.id); // outgoing props

    for (const adjacentNodes of this._edges.values()) {
      adjacentNodes.delete(node.id);
    }

    for (const toMap of this._edgeProps.values()) {
      toMap.delete(node.id); // incoming props
    }

    return this;
  }

  /**
   * Gets the adjacent node ids set for the given node id.
   */
  adjacent(id: NodeID): ReadonlyMap<NodeID, ReadonlySet<EdgeKind>> | undefined {
    return this._edges.get(id);
  }

  getEdgeProperties(from: NodeID, to: NodeID, kind: EdgeKind): EdgeProps {
    return this._edgeProps.get(from)?.get(to)?.get(kind);
  }

  /**
   * Adds an edge to the graph.
   */
  addEdge(edge: Edge): this {
    this._assertResolved(edge);
    const { from, to, kind, props } = edge;

    if (!this._edges.has(from)) {
      throw new GraphError(
        "GRAPH_NO_NODE",
        `There is no node with id: ${from}`,
      );
    }

    const adjacentNodes = this._adjacent(from);
    defined(adjacentNodes);

    if (!adjacentNodes.has(to)) {
      adjacentNodes.set(to, new Set());
    }

    adjacentNodes.get(to)!.add(kind);

    if (props !== undefined) {
      this._setEdgeProperties(from, to, kind, props);
    }

    return this;
  }

  removeEdge(from: NodeID, to: NodeID, kind: EdgeKind): this {
    this._edges.get(from)?.get(to)?.delete(kind);
    this._edgeProps.get(from)?.get(to)?.delete(kind);
    return this;
  }

  /**
   * Returns true if there is an edge from the `source` node to `target` node.
   */
  hasEdge(from: NodeID, to: NodeID, kind: EdgeKind): boolean {
    return this._edges.get(from)?.get(to)?.has(kind) ?? false;
  }

  destroy() {
    this._nodes.clear();
    this._edges.clear();
    this._edgeProps.clear();
  }

  serialize(): { nodes: Node[]; edges: ResolvedEdge[] } {
    const nodes = Array.from(this._nodes.values());
    const edges: ResolvedEdge[] = [];

    for (const [from, toMap] of this._edges) {
      for (const [to, kinds] of toMap) {
        for (const kind of kinds) {
          const props = this._edgeProps.get(from)?.get(to)?.get(kind);
          edges.push({
            from,
            to,
            kind,
            resolved: true,
            ...(props !== undefined && { props }),
          });
        }
      }
    }

    return { nodes, edges };
  }

  private _adjacent(id: NodeID): Map<NodeID, Set<EdgeKind>> | undefined {
    return this._edges.get(id);
  }

  /**
   * Sets the properties of the given edge.
   */
  private _setEdgeProperties(
    from: NodeID,
    to: NodeID,
    kind: EdgeKind,
    props: EdgeProps,
  ): this {
    if (!this._edgeProps.has(from)) {
      this._edgeProps.set(from, new Map());
    }

    const fromMap = this._edgeProps.get(from);
    defined(fromMap);

    if (!fromMap.has(to)) {
      fromMap.set(to, new Map());
    }

    fromMap.get(to)!.set(kind, props);
    return this;
  }

  private _assertResolved(edge: Edge): asserts edge is ResolvedEdge {
    if (!edge.resolved) {
      throw new GraphError(
        "GRAPH_UNRESOLVED_EDGE",
        `Unresolved edge target: ${edge.to}`,
      );
    }
  }
}

export { Graph };
