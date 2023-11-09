const Parser = require("./Parser.js");

/** get key info from specific file */
function build(filepath) {
  const { getAst, getDependencies, getCode } = Parser;
  const ast = getAst(filepath);
  const dependencies = getDependencies(ast, filepath);
  const code = getCode(ast);
  // 文件路径、依赖和源码
  return {
    filename,
    dependencies,
    code,
  };
}

/** start  */
function run() {
  const info = this.build(this.entry);
  this.modules.push(info);
  // get all dependencies by dfs
  this.modules.forEach((obj) => {
    // avoid resolving repetitive module
    if (!this.modules.includes(obj.filename)) {
      obj.dependencies?.forEach((dependency) => {
        this.modules.push(this.build(dependency));
      });
    }
  });

  // generate the dependency graph
  const dependencyGraph = this.modules.reduce(
    (graph, item) => ({
      ...graph,
      [item.filename]: {
        dependencies: item.dependencies,
        code: item.code,
      },
    }),
    {}
  );

  // TODO: generate code with the dependency graph
}

function Compiler(config) {
  this.entry = config.entry;
  this.output = config.output;
  this.modules = config.modules;
}
Compiler.prototype.run = run;

module.exports = Compiler;
