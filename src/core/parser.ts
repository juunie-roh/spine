import Parser, { Query } from "tree-sitter";

const g = globalThis as unknown as { __parser?: Parser };

export const parser = g.__parser ?? new Parser();

export function query(node: Parser.SyntaxNode, queryString: string) {
  const language = parser.getLanguage();
  const query = new Query(language, queryString);
  return query.matches(node);
}
