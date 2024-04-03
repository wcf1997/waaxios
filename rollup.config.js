function setOutput() {
  const path = "dist/"; // 编译后代码存放地址
  const output = [];

  if (process.env.NODE_ENV === "production") {
    ["iife", "es", "umd"].forEach(item => {
      output.push({
        dir: path + item,
        format: item,
        name: "v3-usehook"
      });
    });
  } else {
    output.push({
      dir: path,
      format: "es",
      name: "v3-usehook"
    });
  }

  return output;
}

export default {
  input: "./src/index.ts",
  output: setOutput(),
  external: [], // 忽略打包文件数组,
  plugins: [
    // 打包插件
    commonjs({
      extensions: [".js", ".ts"],
      sourceMap: true
    }),
    typescript({
      lib: ["es5", "es6", "dom"],
      target: "es5", // 输出目标
      noEmitOnError: true // 运行时是否验证ts错误
    }),
    resolve({
      mainFields: ["module", "main", "browser"]
    }),
    babel({
      extensions: [".js", ".ts"],
      babelHelpers: "bundled"
    }) // babel配置,编译es6
  ]
};
