const Compiler = require("./Compiler.js");

function webpack(config) {
  const compiler = new Compiler(config);
  compiler.run();
}

module.exports = webpack;
