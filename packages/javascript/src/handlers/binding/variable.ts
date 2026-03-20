import { createChildPath, createConvertResult, getRange } from "symbex/utils";

import type { ConvertHandler, Edge, Node } from "@/types";

import flatPattern from "../utility/pattern";

const variableHandler: ConvertHandler<"variable"> = (captures, parent) => {
  const result = createConvertResult<Node, Edge>();
  const excludes = new Set([
    "arrow_function",
    "function_expression",
    "generator_function",
    "class",
  ]);

  for (const c of captures) {
    const { node, kind, name } = c;

    const declarator = node.namedChildren.find(
      (c) => c.type === "variable_declarator",
    );
    // exclude value node types:
    if (
      declarator?.childForFieldName("value")?.type &&
      excludes.has(declarator.childForFieldName("value")!.type)
    ) {
      continue;
    }

    if (name.type === "identifier") {
      const path = createChildPath(parent, name.text);
      result.edges.push({
        from: parent,
        to: path,
        kind: "defines",
      });
      result.nodes.push({
        path,
        type: "binding",
        kind: "variable",
        at: getRange(node),
        props: { kind: kind.text },
      });
    } else {
      for (const { name: nm, node: n, has_default } of flatPattern(name)) {
        const path = createChildPath(parent, nm);
        result.edges.push({
          from: parent,
          to: path,
          kind: "defines",
        });
        result.nodes.push({
          path,
          type: "binding",
          kind: "variable",
          at: getRange(n),
          props: { kind: kind.text, has_default },
        });
      }
    }
  }

  return result;
};

export default variableHandler;
