import type TSParser from "tree-sitter";

namespace Capture {
  export interface Base {
    id: string;
    node: TSParser.SyntaxNode;
    /**
     * An identifier.
     */
    name?: string;
  }

  export interface Function extends Base {
    body: Result;
    type_params: string[];
    params: string[];
    return_type?: string;
  }

  export interface Call extends Base {}

  export interface Method extends Base {
    body: Result;
    modifier?: string;
    is_static: boolean;
    type_params: string[];
    params: string[];
    return_type?: string;
  }

  export interface Field extends Base {
    modifier?: string;
    is_static: boolean;
    type?: string;
    value?: string;
  }

  export interface ClassBody {
    methods: Method[];
    fields: Field[];
  }

  export interface Class extends Base {
    body: ClassBody;
    type_params: string[];
    implements: string[];
    extends: string[];
  }

  export interface AbstractClass extends Base {}

  export interface Import extends Base {
    source: string;
    type?: "default" | "named_imports" | "namespace_import";
    alias?: string;
  }

  export interface Result {
    imports: Capture.Import[];
    functions: Capture.Function[];
    classes: Capture.Class[];
  }
}

export type { Capture };
