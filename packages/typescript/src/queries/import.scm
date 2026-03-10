;; imports
;; import "@source";
;; import @name from "@source";
;; import * as @name from "@source";
;; import { @name as @alias } from "@source";
(import_statement
  ("type")? @is_type
  (import_clause
    [
      (identifier) @name
      (namespace_import (identifier) @name)
      (named_imports
        (import_specifier
          ("type")? @is_type
          name: (identifier) @name
          alias: (identifier)? @alias
          (#not-eq? @is_type "type")))
    ])?
  source: (string (string_fragment) @source)
  (#not-eq? @is_type "type")
) @import

;; import type @name from "@source";
;; import type * as @name from "@source";
;; import type { @name as @alias } from "@source";
(import_statement
  ("type") @is_type
  (import_clause
    [
      (identifier) @name
      (namespace_import (identifier) @name)
      (named_imports
        (import_specifier
          name: (identifier) @name
          alias: (identifier)? @alias))
    ])
  source: (string (string_fragment) @source)
) @import

;; import { type @name as @alias } from "@source";
(import_statement
  (import_clause
    (named_imports
      (import_specifier
        ("type") @is_type
        name: (identifier) @name
        alias: (identifier)? @alias)))
  source: (string (string_fragment) @source)
) @import