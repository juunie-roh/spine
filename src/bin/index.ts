#!/usr/bin/env node

import { program } from "commander";

import { print } from "@/core/print";

import pkg from "../../package.json";

program
  .version(pkg.version)
  .description(pkg.description)
  .argument("<file>", "a target file name to parse")
  .argument("[others...]", "additional files")
  .action(async (file, others, options, command) => {
    console.log(file);
    // others?.forEach((file: string) => console.log(file));
    // TODO: Discriminate file extensions
    // TODO: Check if current module supports - Error specification
    // TODO: Plugin interface definition
    // TODO: Plugin availability check - Error specification
    const { parse } = await import("@/typescript/index.js");
    const tree = await parse(file);
    print(tree);
  });

program.parse(process.argv);
