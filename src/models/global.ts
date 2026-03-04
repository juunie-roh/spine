import type TSParser from "tree-sitter";

interface Node<K extends string = string> {
  /**
   * Unique human-readable id identifying the node.
   *
   * Uses a colon `:` as a depth separator.
   * @example "src/models/base.ts:Node"
   */
  id: string;
  /**
   * Kind of this node.
   */
  kind: K;
  /**
   * A range of positions in a multi-line text document, specified both in terms of byte offsets and row/column positions.
   * @see {@link TSParser.Range | tree-sitter `Range`}
   */
  range?: TSParser.Range;
  /**
   * Language-specific property supplements.
   */
  props?: Record<string, unknown>;
}

/**
 * Identified by a composite key (from + to + kind).
 */
interface Edge<K extends string = string> {
  /**
   * ID of the source node where the relationship originates.
   */
  from: Node["id"];
  /**
   * ID of the target node where the relationship terminates.
   */
  to: string;
  /**
   * Kind of relationship this edge represents.
   */
  kind: K;
  /**
   * Whether the target node id has been resolved.
   */
  resolved?: boolean;
  /**
   * Language-specific property supplements.
   */
  props?: Record<string, unknown>;
}

export type { Edge, Node };
