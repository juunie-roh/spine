import { QueryMap } from "letant/query";
import type Parser from "tree-sitter";
import JavaScript from "tree-sitter-python";

import { QueryConfig } from "./types";

export const language = JavaScript as Parser.Language;

export const query = new QueryMap<keyof QueryConfig>(language);
