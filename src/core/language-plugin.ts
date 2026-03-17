import TSParser from "tree-sitter";

import type { Edge, Node, NodePath } from "@/models";

import CoreError from "./error";

/**
 * Represents a loaded and initialized symbex language plugin.
 */
class LanguagePlugin {
  private _parser: TSParser;

  private _module: LanguagePlugin.Module;

  constructor(packageName: string) {
    this._module = LanguagePlugin.load(packageName);
    this._parser = new TSParser();
    this._parser.setLanguage(this._module.language);
  }

  /**
   * The {@link TSParser.Language | tree-sitter `Language`} instance used by this plugin.
   */
  get language() {
    return this._module.language;
  }

  /**
   * Parses a source file to the {@link TSParser.Tree | tree-sitter `Tree`}.
   * @param filePath Path to the source file to parse.
   * @param source String source to parse.
   * @param oldTree Previous tree for incremental parsing.
   * @param options Parsing options passed to tree-sitter.
   * @throws If the language plugin fails to parse the file.
   */
  parse(
    filePath: string,
    source: string,
    oldTree?: TSParser.Tree | null,
    options?: TSParser.Options,
  ): TSParser.Tree {
    try {
      return this._parser.parse(source, oldTree, options);
    } catch (e) {
      throw new CoreError(
        "CORE_PLUGIN_PARSE_FAILED",
        `Failed to parse ${filePath}`,
        { cause: e },
      );
    }
  }

  extract(
    filePath: string,
    node: TSParser.SyntaxNode,
  ): { edges: Edge[]; nodes: Node[] } {
    const captures = this._module.capture(node);
    return this._module.convert(captures, [filePath] as NodePath);
  }
}

namespace LanguagePlugin {
  /**
   * Plugin package module interface.
   */
  export interface Module {
    language: TSParser.Language;
    /**
     * Temporary field.
     * @todo Specify fields.
     */
    [k: string]: any;
  }

  /**
   * Loads a language module with the name provided.
   * @param name The npm package name of the plugin.
   * @returns The resolved module containing language, query string, and converter.
   * @throws If the package cannot be found under `node_modules`.
   * @throws If the loaded module is incompatible with {@link LanguagePlugin.Module | language module}.
   */
  export function load(name: string): Module {
    let m: Module;

    try {
      require.resolve(name);
    } catch (e) {
      throw new CoreError(
        "CORE_PLUGIN_LOAD_FAILED",
        `Plugin "${name}" not found in node_modules`,
        { cause: e },
      );
    }

    try {
      m = require(name);
    } catch (e) {
      throw new CoreError(
        "CORE_PLUGIN_LOAD_FAILED",
        `Plugin "${name}" threw during initialization`,
        { cause: e },
      );
    }

    if (!isModule(m)) {
      throw new CoreError(
        "CORE_PLUGIN_LOAD_FAILED",
        `Failed to load plugin "${name}": module is incompatible with Plugin.Module.`,
      );
    }

    return m;
  }

  /**
   *
   * @param m A module to validate.
   */
  function isModule(m: unknown): m is Module {
    return (
      typeof m === "object" &&
      m !== null &&
      "language" in m &&
      typeof m.language === "object" &&
      m.language !== null &&
      isLanguage(m.language)
    );
  }

  function isLanguage(lang: unknown): lang is TSParser.Language {
    return (
      typeof lang === "object" &&
      lang !== null &&
      "name" in lang &&
      lang.name !== null &&
      "language" in lang &&
      lang.language !== null &&
      "nodeTypeInfo" in lang &&
      lang.nodeTypeInfo !== null &&
      Array.isArray(lang.nodeTypeInfo)
    );
  }
}

export default LanguagePlugin;
