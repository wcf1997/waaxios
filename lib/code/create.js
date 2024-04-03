const { program } = require("commander");
const { createFile } = require("./options.js");
const createCommands = () => {
  program
    .command("create [path]")
    .description("create file")
    .action(path => {
      createFile(path);
    });
};
module.exports = createCommands;
