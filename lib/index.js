const Compiler = require("./Compiler.js");

function webpack() {
  const compiler = new Compiler(config);
  compiler.run();
}

module.exports = {
  webpack,
};
