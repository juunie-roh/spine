import { createCapture } from "symbex/utils";
import type TSParser from "tree-sitter";

import { bypass, query } from "./query";
import type { QueryConfig } from "./types";

const capture = createCapture<QueryConfig>(query, {
  class: {
    bypass(node) {
      const matches: TSParser.QueryMatch[] = [];

      if (node.type === "program") {
        const captured = bypass
          .get("class")
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
          .get("function")
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
});

export { capture };
