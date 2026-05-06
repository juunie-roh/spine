import type * as letant from "letant";

export type QueryConfig = {};

export type NodeKind =
  | letant.Head<keyof QueryConfig>
  | "parameter"
  | "component"
  | "else";

export type Node = letant.Node<NodeKind>;

export type EdgeKind = "defines" | "contains" | "imports";

export type Edge = letant.Edge<EdgeKind>;

export type CaptureConfig = letant.CaptureConfig<QueryConfig>;

export type SingleCaptureResult<K extends keyof QueryConfig> =
  letant.SingleCaptureResult<QueryConfig[K]>;

export type FullCaptureResult = letant.FullCaptureResult<QueryConfig>;

export type ConvertConfig = letant.ConvertConfig<QueryConfig, Node, Edge>;

export type ConvertContext = letant.ConvertContext<QueryConfig, Node, Edge>;

export type ConvertResult = letant.ConvertResult<Node, Edge>;

export type ConvertHandler<K extends keyof QueryConfig> = letant.ConvertHandler<
  QueryConfig,
  QueryConfig[K],
  Node,
  Edge
>;

export type Descriptor = letant.Plugin.Descriptor<QueryConfig, Node, Edge>;
