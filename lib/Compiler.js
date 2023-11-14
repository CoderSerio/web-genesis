const Parser = require("./Parser.js");
const fs = require("fs");
const { file } = require("@babel/types");

/** generate code with the dependency graph */
function generate(code) {
  const filePath = path.join(this.output.path, this.output.filePath);
  const bundle = `
  (function(graph){
    function require(moduleId) {
      function localRequire(relativePath) {
        return require(graph[moduleId].dependencies[relativePath]);
      }

      const exports = {};

      (function(require, exports, code) {
        eval(code);
      })(localRequire, exports, graph[moduleId].code);
      
      return exports;
    }
    require('${this.entry}');
  })(${JSON.stringify(code)})`;

  // write the bundle into a file
  fs.writeFileSync(filePath, bundle);
}

/** get key info from specific file, which is also called module */
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
        const module = this.build(dependency);
        this.modules.push(module);
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

  // generate code with the dependency graph
  this.generate(dependencyGraph);
}

function Compiler(config) {
  this.entry = config.entry;
  this.output = config.output;
  this.modules = config.modules;
}
Compiler.prototype.run = run;

module.exports = Compiler;
