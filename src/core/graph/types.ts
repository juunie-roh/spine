import type { Edge, Node } from "@/models";

type NodeID = Node["id"];
type EdgeKind = Edge["kind"];
type EdgeProps = Edge["props"];
type ResolvedEdge = Edge & { to: NodeID; resolved: true };

function isEdge(item: any): item is Edge {
  return (
    "from" in item &&
    "to" in item &&
    "kind" in item &&
    "resolved" in item &&
    typeof item.resolved === "boolean"
  );
}

export { isEdge };
export type { EdgeKind, EdgeProps, NodeID, ResolvedEdge };
