import { Capture, Edge, Node } from "./models";

function fromImports(imports: Capture.Import[]): Node[] {
  const nodes: Node[] = [];

  for (const imp of imports) {
    if (!imp.source) continue;

    const edge: Edge = {
      from: imp.source,
      to: imp.id,
      kind: "import",
    };

    nodes.push({
      id: imp.source,
      kind: "module",
      meta: {
        names: imp.names,
      },
      edges: [edge],
    });
  }

  return nodes;
}

function convert(captures: Capture.Result) {
  const nodes = fromImports(captures.imports);

  return nodes;
}

export { convert };
