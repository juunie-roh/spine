import Parser from "tree-sitter";

import { GraphCursor, PluginHandler } from "@/core";
import type { Config } from "@/models";

import WorkspaceError from "./error";

class Workspace {
  private _handler: PluginHandler;
  private _files: Map<string, PluginHandler.ParseResult>;

  constructor(config: Config) {
    this._handler = new PluginHandler(config);
    this._files = new Map();
  }

  open(filePath: string, source: string): PluginHandler.ParseResult {
    const parsed = this._handler.parse(filePath, source);
    this._files.set(filePath, parsed);
    return parsed;
  }

  get(filePath: string): PluginHandler.ParseResult {
    const parsed = this._files.get(filePath);
    if (!parsed) {
      throw new WorkspaceError(
        "WORKSPACE_FILE_NOT_PARSED",
        `"${filePath}" has not been opened`,
      );
    }
    return parsed;
  }

  has(filePath: string): boolean {
    return this._files.has(filePath);
  }

  trace(filePath: string, target: Parser.Point | number) {
    const { graph, tree, language } = this.get(filePath);
    const cursor = GraphCursor.at(graph, target);

    const cursorNode = cursor.node;

    let offset: number;

    if (cursorNode.type !== "binding") {
      // for scope node, set start index as its block start index
      offset = cursorNode.blockStartIndex;
    } else if ("name" in cursorNode.at) {
      // if the node is an imported module, start at root
      offset = 0;
    } else {
      // neither, then set start index at the node's.
      offset = cursorNode.at.startIndex;
    }

    const node =
      tree.rootNode.descendantForIndex(offset).parent ?? tree.rootNode;

    const references = this._handler.references(node, language);

    // temporary logs of result
    console.log(cursor.name, cursor.node.at, cursor.node.blockStartIndex);

    for (const ref of references) {
      const resolved = cursor.resolve(ref);
      if (!resolved) {
        console.log(`Unresolved reference: ${ref}`);
      } else {
        console.log(
          resolved.path.join(" > "),
          resolved.node.kind,
          "at:",
          "name" in resolved.node.at
            ? `${resolved.node.at.name}(${resolved.node.at.external ?? false})`
            : resolved.node.at.startPosition.row,
        );
      }
    }
  }

  destroy(): void {
    this._handler.destroy();
    this._files.clear();
  }
}

export default Workspace;
