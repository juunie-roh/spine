import type TSParser from "tree-sitter";

namespace Capture {
  export interface Base {
    id: string;
    node?: TSParser.SyntaxNode;
    body?: TSParser.SyntaxNode;
    /**
     * An identifier.
     */
    name?: string;

    [k: string]: any;
  }

  export interface Function extends Base {
    generics: string[];
    params: any;
    return_type?: string;
  }

  export interface Call extends Base {}

  export interface Class extends Base {}

  export interface AbstractClass extends Base {}

  export interface Import extends Base {
    names?: {
      type: string;
      name: string;
      alias?: string;
    }[];
    source: string;
  }

  export interface Result {
    imports: Capture.Import[];
    functions: Capture.Function[];
  }
}

export type { Capture };
