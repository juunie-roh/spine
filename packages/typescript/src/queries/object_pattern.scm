(object_pattern
  (pair_pattern key: (_) @value value: (_) @name)?
  (shorthand_property_identifier_pattern)? @name
  (object_assignment_pattern
    left: 
      (array_pattern)? @array_pattern
      (object_pattern)? @object_pattern
    right:
      (expression) @value
  )?
)