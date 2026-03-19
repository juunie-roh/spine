import { createChildPath, createConvertResult, getRange } from "symbex/utils";

import { ConvertHandler, Edge, Node } from "@/types";

const typeHandler: ConvertHandler<"type"> = (captures, parent) => {
  const result = createConvertResult<Node, Edge>();

  for (const c of captures) {
    const { node, name, type_parameters } = c;

    const path = createChildPath(parent, name.text);
    result.edges.push({
      from: parent,
      to: path,
      kind: "defines",
      props: { type: true },
    });
    result.nodes.push({
      path,
      type: "binding",
      kind: "type",
      at: getRange(node),
      props: {
        type_parameters: type_parameters?.text,
      },
    });
  }

  return result;
};

export default typeHandler;
