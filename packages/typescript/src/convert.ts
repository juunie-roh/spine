import abstractClassHandler from "./handlers/abstract-class";
import abstractMethodHandler from "./handlers/abstract-method";
import classHandler from "./handlers/class";
import functionHandler from "./handlers/function";
import importHandler from "./handlers/import";
import memberHandler from "./handlers/member";
import methodHandler from "./handlers/method";
import patternHandler from "./handlers/pattern";
import typeHandler from "./handlers/type";
import variableHandler from "./handlers/variable";
import type { ConvertConfig } from "./types";

export const convertConfig = {
  abstract_class: abstractClassHandler,
  abstract_method: abstractMethodHandler,
  class: classHandler,
  function: functionHandler,
  import: importHandler,
  member: memberHandler,
  method: methodHandler,
  type: typeHandler,
  pattern: patternHandler,
  variable: variableHandler,
} as const satisfies ConvertConfig;
