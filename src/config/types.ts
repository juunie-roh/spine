import { Language } from "tree-sitter";

export interface Config {
  plugin: {
    ext: string;
    name: string;
  }[];
}

export interface PluginConfig {
  language: Language;
  convert: any;
  queryString: string;
}
