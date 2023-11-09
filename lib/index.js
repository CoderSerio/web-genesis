const { Compiler } = require("./Compiler.js");

function webpack() {
  // TODO: 实现 compiler 用于解析参数
  const compiler = new Compiler(config);
  compiler.run();
}

module.exports = {
  webpack,
};
