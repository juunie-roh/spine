import type TSParser from "tree-sitter";

interface Node {
  /**
   * Unique human-readable id identifying the node.
   * @example "src/models/base.ts:interface:Node"
   */
  id: string;
  /**
   * Kind of this node.
   */
  kind: string;
  /**
   * A range of positions in a multi-line text document, specified both in terms of byte offsets and row/column positions.
   * @see {@link TSParser.Range | tree-sitter `Range`}
   */
  range?: TSParser.Range;
  /**
   * Outgoing edges connecting this node to related nodes.
   */
  edges?: Edge[];
  /**
   * Language-specific metadata supplement.
   */
  meta?: Record<string, unknown>;
}

interface Edge {
  /**
   * ID of the source node where the relationship originates.
   */
  from: string;
  /**
   * ID of the target node where the relationship terminates.
   */
  to: string;
  /**
   * Kind of relationship this edge represents.
   */
  kind: string;
}

export type { Edge, Node };
