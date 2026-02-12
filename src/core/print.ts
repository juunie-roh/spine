import Parser from "tree-sitter";

import { query } from "./parser";

export function print(tree?: Parser.Tree) {
  if (tree) {
    const root = tree.rootNode;
    query(
      root,
      `
; 1. function declaration
(function_declaration
  name: (identifier) @function.name
  type_parameters: (type_parameters)? @function.generics
  parameters: (formal_parameters) @function.params
  return_type: (type_annotation (_) @function.return_type)?
) @function.decl

; 2. arrow function / function expression
(lexical_declaration
  (variable_declarator
    name: (identifier) @function.name
    value: [
      (arrow_function
        type_parameters: (type_parameters)? @function.generics
        parameters: (formal_parameters) @function.params
        return_type: (type_annotation (_) @function.return_type)?
      )
      (function_expression
        type_parameters: (type_parameters)? @function.generics
        parameters: (formal_parameters) @function.params
        return_type: (type_annotation (_) @function.return_type)?
      )
    ]
  )
) @function.decl
`,
    ).map((match) => {
      // Reduce all captures into a single object
      const data = match.captures.reduce(
        (acc, capture) => {
          // extract ranges
          if (capture.name === "function.decl") {
            acc["range"] = {
              start: capture.node.startPosition,
              end: capture.node.endPosition,
            };
            return acc;
          }

          const key = capture.name.replace("function.", "");

          acc[key] = {
            text: capture.node.text,
            // get node type itself if needed
            // nodeType: capture.node.type,
          };
          return acc;
        },
        {} as Record<string, any>,
      );

      // index metadata example:
      console.log({
        id: match.captures.find((n) => n.name === "function.decl")?.node.id,
        type: "function declaration",
        data,
      });
    });
  }
}
