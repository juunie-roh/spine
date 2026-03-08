;; class declaration
;; class @name<@type_params> @heritage @body
;; @heritage = impelents @target, @target, ... || extends @target<@type_args>, @target, ...
(class_declaration
  ;; decorator: (decorator)* @decorator
  name: (type_identifier) @name
  (class_heritage)? @heritage
  type_parameters: (type_parameters)? @type_params
  body: (class_body) @body
) @class

;; abstract class declaration
;; abstract class @name<@type_params> @heritage @body
;; @heritage = impelents @target, @target, ... || extends @target<@type_args>, @target, ...
(abstract_class_declaration
  ;; decorator: (decorator)* @decorator
  name: (type_identifier) @name
  (class_heritage)? @heritage
  type_parameters: (type_parameters)? @type_params
  body: (class_body) @body
) @abstract_class
