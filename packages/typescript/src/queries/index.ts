import { QueryMap } from "@juun-roh/spine/query";
import type TSParser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";

import type { QueryTag } from "@/models";

import classQueryString from "./class.scm";
import classBodyQueryString from "./class_body.scm";
import functionQueryString from "./function.scm";
import importQueryString from "./import.scm";
import paramsQueryString from "./params.scm";

const language = TypeScript.typescript as TSParser.Language;

const query = new QueryMap<QueryTag>(language)
  .set("function", functionQueryString)
  .set("import", importQueryString)
  .set("class", classQueryString)
  .set("class_body", classBodyQueryString)
  .set("params", paramsQueryString);

export { language, query };
