;; function declaration
;; function @name<@type_param>(@params): @return_type @body
;; function* @name<@type_param>(@params): @return_type @body
(function_declaration
  name: (identifier) @name
  type_parameters: (type_parameters (type_parameter)+ @type_param)? @type_params
  parameters: (formal_parameters) @params
  return_type: (type_annotation (_) @return_type)?
  body: (statement_block) @body
)@function

(generator_function_declaration
  name: (identifier) @name
  type_parameters: (type_parameters (type_parameter)+ @type_param)?
  parameters: (formal_parameters) @params
  return_type: (type_annotation (_) @return_type)?
  body: (statement_block) @body
) @function

;; arrow function / function expression
;; const/let @name = (@params) => @body
;; const/let @name = function (@params) @body
(lexical_declaration
  (variable_declarator
    name: (identifier) @name
    value: [
      (arrow_function
        type_parameters: (type_parameters (type_parameter)+ @type_param)? @type_params
        parameters: [(formal_parameters) (identifier)] @params
        return_type: (type_annotation (_) @return_type)?
        body: (_) @body)
      (function_expression
        type_parameters: (type_parameters (type_parameter)+ @type_param)? @type_params
        parameters: (formal_parameters) @params
        return_type: (type_annotation (_) @return_type)?
        body: (statement_block) @body)
    ])
) @function