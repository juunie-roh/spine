import Parser from "tree-sitter";

import { query } from "@/core/parser";

type FuncHit = {
  name?: string;
  generics?: string;
  params?: string;
  returnType?: string;

  node: Parser.SyntaxNode;
  body: Parser.SyntaxNode;

  calls: Parser.SyntaxNode[];
};

export function convert(tree?: Parser.Tree) {
  if (!tree) return;

  const root = tree.rootNode;

  const functions: FuncHit[] = [];
  const calls: Parser.SyntaxNode[] = [];

  query(
    root,
    `
; 1. function declaration
(
  function_declaration
    name: (identifier) @name
    type_parameters: (type_parameters)? @generics
    parameters: (formal_parameters) @params
    return_type: [
      (asserts_annotation)
      (type_annotation)
      (type_predicate_annotation)
    ]? @returnType
    body: (statement_block) @body
) @function

; 2. arrow function / function expression
(lexical_declaration
  (variable_declarator
    name: (identifier) @name
    value: [
      (
        arrow_function
          type_parameters: (type_parameters)? @generics
          parameters: (formal_parameters) @params
          return_type: [
            (asserts_annotation)
            (type_annotation)
            (type_predicate_annotation)
          ]? @returnType
          body: (_) @body
      )
      (
        function_expression
          type_parameters: (type_parameters)? @generics
          parameters: (formal_parameters) @params
          return_type: [
            (asserts_annotation)
            (type_annotation)
            (type_predicate_annotation)
          ]? @returnType
          body: (statement_block) @body
      )
    ]
  )
) @function

(call_expression) @call
`,
  ).forEach((match) => {
    let node: Parser.SyntaxNode | null = null;
    let body: Parser.SyntaxNode | null = null;

    // (같은 match에 function 캡처들이 함께 들어오는 케이스를 가정)
    const info: Partial<FuncHit> = { calls: [] };

    for (const cap of match.captures) {
      if (cap.name === "function") node = cap.node;
      else if (cap.name === "body") body = cap.node;
      else if (cap.name === "call") {
        if (!isMemberCall(cap.node)) {
          calls.push(cap.node);
        }
      } else {
        // name/params/... 은 text로
        (info as any)[cap.name] = cap.node.text;
      }
    }

    if (node && body) {
      functions.push({
        ...info,
        node,
        body,
        calls: [],
      });
    }
  });

  // 2) call -> function 매핑
  // 포함 관계: body.startIndex <= call.startIndex && call.endIndex <= body.endIndex
  for (const call of calls) {
    const owner = findInnermostOwner(functions, call);
    if (owner) owner.calls.push(call);
  }

  // 3) 출력 형태로 변환
  const nodes = functions.map((fn) => ({
    file: process.argv[2],
    type: "function",
    range: {
      start: fn.node.startPosition,
      end: fn.node.endPosition,
    },
    container: fn.node.parent?.type !== "program" ? fn.node.parent : null,

    name: fn.name,
    generics: fn.generics,
    params: fn.params,
    returnType: fn.returnType,

    calls: fn.calls.map((c) => ({
      text: c.text,
      range: { start: c.startPosition, end: c.endPosition },
    })),
  }));

  return nodes;
}

function contains(body: Parser.SyntaxNode, n: Parser.SyntaxNode) {
  return body.startIndex <= n.startIndex && n.endIndex <= body.endIndex;
}

/**
 * call이 여러 body에 포함될 수 있음(중첩 함수).
 * 가장 안쪽(= body 범위가 가장 작은) 함수를 선택.
 */
function findInnermostOwner(
  funcs: FuncHit[],
  call: Parser.SyntaxNode,
): FuncHit | null {
  let best: FuncHit | null = null;
  let bestSpan = Infinity;

  for (const f of funcs) {
    if (!contains(f.body, call)) continue;

    const span = f.body.endIndex - f.body.startIndex;
    if (span < bestSpan) {
      best = f;
      bestSpan = span;
    }
  }
  return best;
}

function isMemberCall(call: Parser.SyntaxNode): boolean {
  if (call.type !== "call_expression") return false;

  // exclude optional chaining call
  if (hasAncestor("optional_chain", call)) return true;

  const fn = call.childForFieldName("function");
  if (!fn) return false;

  const base = unwrap(fn);

  // obj.foo()
  if (base.type === "member_expression") return true;

  // optional chaining can be included depending on grammar
  if (base.type === "optional_chain") return true;

  return false;
}

function hasAncestor(type: string, node: Parser.SyntaxNode): boolean {
  let cur = node.parent;
  while (cur) {
    if (cur.type === type) return true;
    cur = cur.parent;
  }
  return false;
}

function unwrap(node: Parser.SyntaxNode): Parser.SyntaxNode {
  let cur = node;
  while (true) {
    if (cur.type === "parenthesized_expression") {
      const inner = cur.namedChild(0);
      if (!inner) break;
      cur = inner;
      continue;
    }
    if (cur.type === "as_expression" || cur.type === "type_assertion") {
      const inner = cur.childForFieldName("expression") ?? cur.namedChild(0);
      if (!inner) break;
      cur = inner;
      continue;
    }
    if (cur.type === "non_null_expression") {
      const inner = cur.namedChild(0);
      if (!inner) break;
      cur = inner;
      continue;
    }
    break;
  }
  return cur;
}
