const path = require("path");
const Parser = require("./Parser.js");
const fs = require("fs");

/** generate code with the dependency graph */
function generate(graph) {
  const templatePath = path.resolve(__dirname, "./template.ejs");
  const template = fs.readFileSync(templatePath, {
    encoding: "utf-8",
  });
  // bundle is a code fragment which can run
  // hijack the 'require' and 'exports' in code with our 'localRequire' and 'globalExports'
  const bundle = `
  ;(function(graph, moduleId) {
    
    function localRequire(relativePath) {
      return globalRequire(graph[moduleId].dependencies[relativePath]);
    }

    function globalRequire(moduleId) {
      var globalExports = {};

      ;(function(require, exports, code) {
        eval(code);
      })(localRequire, globalExports, graph[moduleId].code);
    
      return globalExports;
    }

    globalRequire(moduleId);
  })(${JSON.stringify(graph)}, ${JSON.stringify(this.entry)})`;

  // write the bundle into a file
  fs.mkdirSync(this.output.path, { recursive: true });
  const filePath = path.posix.join(this.output.path, this.output.filename);
  fs.writeFileSync(filePath, bundle);
}

/** get key info from specific file, which is also called module */
function build(filename) {
  const { getAst, getDependencies, getCode } = Parser;
  const ast = getAst(filename);
  const dependencies = getDependencies(ast, filename);
  const code = getCode(ast);

  return {
    filename,
    dependencies,
    code,
  };
}

/** start, and generate dependency graph */
function run() {
  const info = this.build(this.entry);
  this.modules.push(info);
  // get all dependencies by dfs
  this.modules.forEach((obj) => {
    // avoid resolving repetitive module
    const isRepeated = this.modules.includes(obj.filename);
    if (!isRepeated) {
      Object.keys(obj.dependencies).forEach((key) => {
        const dependency = obj.dependencies[key];
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
  this.modules = [];
}

Compiler.prototype.run = run;
Compiler.prototype.build = build;
Compiler.prototype.generate = generate;

module.exports = Compiler;
