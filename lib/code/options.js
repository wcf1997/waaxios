const { copyDirectory } = require("./utils");

async function createFile(path = "src/request") {
  await copyDirectory("../../template", path);
}

module.exports = {
  createFile
};
