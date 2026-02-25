import { Range } from "tree-sitter";

interface Node {
  /**
   * An unique identifier of the node
   */
  id: string;
  /**
   * A range where to look up the actual content
   * @see {@link Range}
   */
  range: Range;
  /**
   * Relationships connected to the node
   */
  edges?: Edge[];
}

interface Edge {
  /**
   * start node id which the relationship stems from
   */
  from: string;
  /**
   * end node id which the relationship lands on
   */
  to: string;
  /**
   * Explains the relationship the edge owns
   */
  type: string;
}

export type { Edge, Node };
