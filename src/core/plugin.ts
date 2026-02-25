import { readFileSync } from "node:fs";

import TSParser from "tree-sitter";

/**
 * @class
 * An initialized plugin instance
 */
class Plugin {
  private _parser: TSParser;

  private _language: TSParser.Language;

  private _query: TSParser.Query;

  private _convert: any;

  constructor(name: string) {
    const { language, convert, queryString } = require(name);
    this._parser = new TSParser();
    this._language = language;
    this._parser.setLanguage(language);
    this._query = new TSParser.Query(language, queryString);
    this._convert = convert;
  }

  get language() {
    return this._language;
  }

  get query() {
    return this._query;
  }

  parse(
    file: string,
    oldTree?: TSParser.Tree | null,
    options?: TSParser.Options,
  ) {
    const source = readFileSync(file, "utf-8");
    const tree = this._parser.parse(source, oldTree, options);
    return this._convert(tree, this._query, file);
  }
}

export { Plugin };
