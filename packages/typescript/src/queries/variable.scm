;; variable declarations
;; @kind @name: @type = @body
;; @kind { @name, @value: @name }: @type = @body
;; @kind [ @name, @name ]: @type = @body

;; @kind = "const" | "let"
(lexical_declaration
  [("const") ("let")] @kind
  (variable_declarator
    name: [
      (identifier) @name
      (array_pattern) @pattern
      (object_pattern) @pattern
      ;; (array_pattern (identifier) @name)
      ;; (object_pattern
      ;;   (pair_pattern key: (_) @key value: (identifier) @name)
      ;;   (shorthand_property_identifier_pattern) @name)
    ]
    type: (type_annotation (type) @type)?)
) @node

;; @kind = "var"
(variable_declaration
  ("var") @kind
  (variable_declarator
    name: [
      (identifier) @name
      (array_pattern) @pattern
      (object_pattern) @pattern
      ;; (array_pattern (identifier) @name)
      ;; (object_pattern
      ;;   (pair_pattern key: (_) @key value: (identifier) @name)
      ;;   (shorthand_property_identifier_pattern) @name)
    ]
    type: (type_annotation (type) @type)?)
) @node