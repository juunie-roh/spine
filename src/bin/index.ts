#!/usr/bin/env node

import { program } from "commander";

import pkg from "../../package.json";

program
  .version(pkg.version)
  .description(pkg.description)
  .argument("<file>", "a target file name to parse")
  .argument("[others...]", "additional files")
  .option("-l, --list", "print a list of nodes", false)
  .action(async (file, others, options, command) => {
    // others?.forEach((file: string) => console.log(file));
    // TODO: Discriminate file extensions
    // TODO: Check if current module supports - Error specification
    // TODO: Plugin interface definition
    // TODO: Plugin availability check - Error specification
    const { parse, convert } = await import("@/typescript/index.js");
    const tree = convert(await parse(file));
    if (options.list) {
      console.log(tree);
    }
  });

program.parse(process.argv);
