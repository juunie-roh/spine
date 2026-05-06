;; function declaration
[
  ;; declarations
  (function_expression name: (identifier) @name) @definition.function
  (function_declaration name: (identifier) @name) @definition.function
  (generator_function name: (identifier) @name) @definition.function
  (generator_function_declaration name: (identifier) @name) @definition.function
  ;; assigned declarations
  (lexical_declaration
    (variable_declarator
      name: (identifier) @name
      value: [
        (arrow_function)
        (function_expression)
        (generator_function)
        (parenthesized_expression
          [(arrow_function) (function_expression) (generator_function)])
      ] @definition.function))
  (variable_declaration
    (variable_declarator
      name: (identifier) @name
      value: [
        (arrow_function)
        (function_expression)
        (generator_function)
        (parenthesized_expression
          [(arrow_function) (function_expression) (generator_function)])
      ] @definition.function))
  ;; (assignment_expression
  ;;   left: [
  ;;     (identifier) @name
  ;;     (member_expression
  ;;       property: (property_identifier) @name)
  ;;   ]
  ;;   right: [
  ;;     (arrow_function)
  ;;     (function_expression)
  ;;     (generator_function)
  ;;     (parenthesized_expression
  ;;       [(arrow_function) (function_expression) (generator_function)])
  ;;   ] @definition.function)
  ;; (pair
  ;;   key: (property_identifier) @name
  ;;   value: [
  ;;     (arrow_function)
  ;;     (function_expression)
  ;;     (generator_function)
  ;;     (parenthesized_expression
  ;;       [(arrow_function) (function_expression) (generator_function)])
  ;;   ] @definition.function)
] @node
