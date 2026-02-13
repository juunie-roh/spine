import Parser, { Query } from "tree-sitter";

const g = globalThis as unknown as { __parser?: Parser };

/**
 * A singleton parser instance
 */
export const parser = g.__parser ?? new Parser();

/**
 * Find nodes matching query
 * @param node a target node to look up
 * @param queryString S-expression query
 * @returns matching nodes for query
 */
export function query(node: Parser.SyntaxNode, queryString: string) {
  const language = parser.getLanguage();
  // TODO: Query interface definition - plugin design
  const query = new Query(language, queryString);
  return query.matches(node);
}
