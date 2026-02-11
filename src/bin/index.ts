#!/usr/bin/env node

import { program } from "commander";

import { print } from "@/core/print";
import parse from "@/typescript";

import pkg from "../../package.json";

program
  .version(pkg.version)
  .description(pkg.description)
  .argument("<file>", "a target file name to parse")
  .argument("[others...]", "additional files")
  .action(async (file, others, options, command) => {
    console.log(file);
    others?.forEach((file: string) => console.log(file));
    const tree = await parse(file);
    print(tree);
  });

program.parse(process.argv);
