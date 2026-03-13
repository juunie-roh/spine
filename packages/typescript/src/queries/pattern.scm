;; [@pattern. @pattern = @default]
(array_pattern
  [
    (assignment_pattern
      left: (pattern) @pattern
      right: (expression) @default)
    (pattern) @pattern
  ]
) @node
(identifier) @node
;; (member_expression)? @member_expression
;; (non_null_expression)? @non_null_expression
(object_pattern
  [
    ;; { @name }
    (shorthand_property_identifier_pattern) @name
    ;; { ...@pattern }
    (rest_pattern (_) @pattern)
    ;; { @key: @pattern, @key: @pattern = @default }
    (pair_pattern
      key: (_) @key
      value: [
        (assignment_pattern
          left: (pattern) @pattern
          right: (expression) @default)
        (pattern) @pattern
      ])
    ;; { @pattern = @default, @name = @default }
    (object_assignment_pattern
      left: [
        [(array_pattern) (object_pattern)] @pattern
        (shorthand_property_identifier_pattern) @name
      ]
      right: (expression) @default)
  ]
) @node
;; ...@pattern
(rest_pattern (_) @pattern) @node
;; @expression[@index]
;; (subscript_expression
;;   object: (expression) @object
;;   index: (_) @index
;; ) @node
;; (undefined)