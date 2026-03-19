import type TSParser from "tree-sitter";

import { bypass, query } from "./query";
import type { CaptureConfig } from "./types";

export const captureConfig = {
  class: {
    bypass(node) {
      const matches: TSParser.QueryMatch[] = [];

      if (node.type === "program") {
        const captured = bypass
          .get("export_class")
          .captures(node, { maxStartDepth: 1 })
          .filter((c) => c.name === "node")
          .map((c) => c.node);
        if (captured.length > 0) {
          for (const c of captured) {
            matches.push(...query.match("class", c, { maxStartDepth: 0 }));
          }
        }
      }

      return matches;
    },
  },
  function: {
    bypass(node) {
      const matches: TSParser.QueryMatch[] = [];

      if (node.type === "program") {
        const captured = bypass
          .get("export_function")
          .captures(node, { maxStartDepth: 1 })
          .filter((c) => c.name === "node")
          .map((c) => c.node);
        if (captured.length > 0) {
          for (const c of captured) {
            matches.push(...query.match("function", c, { maxStartDepth: 0 }));
          }
        }
      }

      return matches;
    },
  },
  type: {
    bypass(node) {
      const matches: TSParser.QueryMatch[] = [];
      if (node.type === "program") {
        const captured = bypass
          .get("export_type_alias")
          .captures(node, { maxStartDepth: 1 })
          .filter((c) => c.name === "node")
          .map((c) => c.node);
        if (captured.length > 0) {
          for (const c of captured) {
            matches.push(...query.match("type", c, { maxStartDepth: 0 }));
          }
        }
      }
      return matches;
    },
  },
} as const satisfies CaptureConfig;
