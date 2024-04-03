const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

function ejsAnalysis(fileName, data = {}, options = {}) {
  return new Promise((resolve, reject) => {
    const templatePath = path.resolve(__dirname, fileName);
    ejs.renderFile(
      templatePath,
      {
        data
      },
      options,
      (err, str) => {
        if (err) {
          console.log("模板引擎解析失败");
          reject(false);
        }
        resolve(str);
      }
    );
  });
}

async function readFile(dirname) {
  dirname = path.resolve(__dirname, dirname);
  return await fs.readFileSync(dirname);
}

async function copyDirectory(src, dest) {
  src = path.resolve(__dirname, src);
  // dest = path.resolve(__dirname, dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  fs.mkdirSync(dest, { recursive: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    console.log("srcPath", srcPath);
    console.log("destPath", destPath);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

module.exports = {
  ejsAnalysis,
  readFile,
  copyDirectory
};
