#!/usr/bin/env node

import { program } from "commander";

import pkg from "../../package.json";

const CWD = process.cwd();

program
  .version(pkg.version)
  .description(pkg.description)
  .argument("<file-name>", "file name")
  .action((args) => {
    console.log(args);
  });

program.parse(process.argv);
