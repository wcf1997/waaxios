#!/usr/bin/env node
"use strict";
const { program } = require("commander");
const helpOptions = require("./lib/help/help.js");
const createCommands = require("./lib/code/create.js");

program
  // 版本名称
  .version(require("./package.json").version);

helpOptions();

createCommands();
program.parse(process.argv);
