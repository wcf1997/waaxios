const { program } = require("commander");

const helpOptions = () => {
  // program.option("-d, --debug", "文件路径 例如: -d src/pages, 错误/src/pages");

  program.on("--help", () => {
    console.log(
      "waxios create [dirname] 可以指定目录创建，没有目录则默认放置request目录"
    );
  });
};

module.exports = helpOptions;
