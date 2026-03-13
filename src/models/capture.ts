import type TSParser from "tree-sitter";

import type { QueryConfig } from "./global";

type CaptureConfig<Q extends QueryConfig> = {
  [K in keyof Q]?: {
    typesToInclude?: string | string[];
    maxStartDepth?: number;
  };
};

type SingleCaptureResult<T extends QueryConfig[string]> = {
  [K in T["required"]]: TSParser.SyntaxNode;
} & {
  [K in T["optional"]]?: TSParser.SyntaxNode;
};

type FullCaptureResult<Q extends QueryConfig> = {
  [K in keyof Q]: SingleCaptureResult<Q[K]>[];
};

export type { CaptureConfig, FullCaptureResult, SingleCaptureResult };
