#!/usr/bin/env node

import { program } from "commander";

import { initParser } from "@/core/parser";
import parse from "@/typescript";

import pkg from "../../package.json";

program
  .version(pkg.version)
  .description(pkg.description)
  .argument("<file>", "a target file name to parse")
  .argument("[others...]", "additional files")
  .hook("preAction", async () => {
    await initParser();
  })
  .action(async (file, others, options, command) => {
    console.log(file);
    others?.forEach((file: string) => console.log(file));
    const tree = await parse(file);
    console.log(tree?.rootNode.toString());
  });

program.parse(process.argv);
