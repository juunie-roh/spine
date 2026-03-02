import type * as Spine from "@juun-roh/spine";

// TODO: specify other declaration kinds
type NodeKind = "module" | "function" | "class" | "abstract_class";

/**
 * Override {@link Spine.Node | `Node`}'s `kind` with language specific {@link NodeKind | kinds of node}.
 */
interface Node extends Spine.Node {
  kind: NodeKind;
}

// TODO: specify other relationship kinds
type EdgeKind = "import" | "call" | "implements" | "extends";

/**
 * Override {@link Spine.Edge | `Edge`}'s `kind` with language specific {@link EdgeKind | kinds of edge}.
 */
interface Edge extends Spine.Edge {
  kind: EdgeKind;
}

export type { Edge, EdgeKind, Node, NodeKind };
