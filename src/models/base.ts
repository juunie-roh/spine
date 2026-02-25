import { SyntaxNode } from "tree-sitter";

interface Node {
  /** The underlying tree-sitter node — source of truth for position and type */
  syntax: SyntaxNode;
  /** Human readable identifier */
  name: string;
  /** Relationships connected to the node */
  edges?: Edge[];
  /** Language-specific metadata supplement */
  meta?: Record<string, unknown>;
}

interface Edge {
  /** start node id which the relationship stems from */
  from: string;
  /** end node id which the relationship lands on */
  to: string;
  /** Explains the relationship the edge owns */
  type: string;
}

export type { Edge, Node };
