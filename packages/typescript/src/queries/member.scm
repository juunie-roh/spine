;; member
;; @modifier @is_static @name: @type
(public_field_definition
  [(accessibility_modifier) (override_modifier)]? @modifier
  ("static")? @is_static
  name: (_) @name
  (type_annotation (type) @type)?
) @member