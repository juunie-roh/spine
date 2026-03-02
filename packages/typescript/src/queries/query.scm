;; imports
;; import @name, { @name, @name as @alias } from "@source";
;; import { @name as @alias } from "@source";
;; import * as @name from "@source";
;; import "@source"
;; TODO: discriminate type imports
(import_statement
  (import_clause
    ;; (named_imports
    ;;   (import_specifier
    ;;     name: (identifier) @name
    ;;     alias: (identifier)? @alias
    ;;   )
    ;; )?
    ;; (namespace_import
    ;;   (identifier) @name
    ;; )?
    ;; (identifier)? @name
  )? @names
  source: (string (_) @source)
) @import

(call_expression) @call

;; function declaration
;; function @name<@generics>(@params): @return_type @body
(function_declaration
    name: (identifier) @name
    type_parameters: (type_parameters)? @generics
    parameters: (formal_parameters) @params
    return_type: (type_annotation)? @return_type
    body: (statement_block) @body
) @function

;; arrow function / function expression
;; const @name = <@generics>(@params): @return_type => @body
;; const @name = <@generics>(@params): @return_type => @body
;; const @name = @params: @return_type => @body (single identifier param)
;; const @name = function <@generics>(@params): @return_type @body
(lexical_declaration
  (variable_declarator
    name: (identifier) @name
    value: [
      (
        arrow_function
          type_parameters: (type_parameters)? @generics
          parameters: [
            (formal_parameters)? @params
            (identifier)? @params
          ]
          return_type: (type_annotation)? @return_type
          body: [
            (statement_block) @body
            (expression) @body
          ]
      )
      (
        function_expression
          type_parameters: (type_parameters)? @generics
          parameters: (formal_parameters) @params
          return_type: (type_annotation)? @return_type
          body: (statement_block) @body
      )
    ]
  )
) @function

;; class declaration
;; @decorator class @name<@generics> @heritage {@body}
;; @heritage = impelents @target, @target, ... || extends @target<@generics>, @target, ...
(class_declaration
  decorator: (decorator)*? @decorator
  name: (type_identifier) @name
  (class_heritage
    (implements_clause
      (type) @target
    )? @implements
    (extends_clause
      value: (expression) @target
      type_arguments: (type_arguments)? @generics
    )? @extends
  )? @heritage
  type_parameters: (type_parameters)? @generics
  body: (class_body (_) @body)
) @class

;; abstract class declaration
;; @decorator abstract class @name<@generics> @heritage {@body}
;; @heritage = impelents @target, @target, ... || extends @target<@generics>, @target, ...
(abstract_class_declaration
  decorator: (decorator)*? @decorator
  name: (type_identifier) @name
  (class_heritage
    (implements_clause
      (type) @target
    )? @implements
    (extends_clause
      value: (expression) @target
      type_arguments: (type_arguments (_) @generics)?
    )? @extends
  )? @heritage
  type_parameters: (type_parameters (_) @generics)?
  body: (class_body (_) @body)
) @abstract_class

;; ;; exports
;; [
;;   ;; export { @name, @name as @alias, type @name, type @name as @alias };
;;   ;; export type { @name, @name as @alias };
;;   (export_statement
;;     (export_clause
;;       (export_specifier
;;         name: (identifier) @name
;;         alias: (identifier)? @alias
;;       )?
;;     )
;;     !source
;;     !value
;;     !declaration
;;   ) @export.named
;;   ;; export * from "@source";
;;   ;; export type * from "@source";
;;   ;; export { @name, @name as @alias, type @name, type @name as @alias } from "@source";
;;   ;; export type { @name, @name as @alias } from "@source";
;;   (export_statement
;;     (export_clause
;;       (export_specifier
;;         name: (identifier) @name
;;         alias: (identifier)? @alias
;;       )?
;;     )?
;;     source: (string (_) @source)
;;   ) @export.re
;;   ;; export default @value;
;;   (export_statement
;;     "default"
;;     value: (_) @value
;;   ) @export.anonymous
;; ] @export