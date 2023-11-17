const path = require("path");
const fs = require("fs");
const tapable = require("tapable");
const Parser = require("./Parser.js");
const EntryPlugin = require("./EntryPlugin.js");

/** handle plugins **and loaders** */
function initPlugins() {
  const compiler = this;

  if (Array.isArray(this.plugins)) {
    // replace all plugins' 'this' with 'compiler'
    this.plugins?.forEach((plugin) => {
      if (typeof plugin === "function") {
        plugin.call(compiler, compiler);
      } else {
        // notice this `apply` is our customized method of EntryPlugin
        plugin.apply(compiler);
      }
    });
  }
}

/** generate code with the dependency graph */
function generate(graph) {
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

// TODO: to be conformed to the principle of single responsibility
/** start, and generate dependency graph */
function run() {
  const info = this.build(this.entry);
  this.modules.push(info);

  this.hooks.compilation.call(this);
  this.hooks.make.callAsync(this, () => {
    console.log("hook make");
  });

  // TODO: we should do this in make stage
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

  this.hooks.emit.callAsync(this, () => {
    console.log("hook emit");
  });
  // TODO: write into the specific file here
  this.hooks.afterEmit.callAsync(this, () => {
    console.log("hook afterEmit");
  });
}

function Compiler(config) {
  this.entry = config.entry;
  this.output = config.output;
  this.modules = config.modules ?? [];
  this.plugins = config.plugins;
  /*
    use tapable's API to implement hooks,
    and all hooks need a complation as their parameter. 
    when we need to develop a plugin, 
    the plugin could invoke these hooks to implement something.
  */
  this.hooks = {
    compilation: new tapable.SyncHook(["compiler"]),
    make: new tapable.AsyncParallelHook(["compiler"]),
    emit: new tapable.AsyncSeriesHook(["compiler"]),
    afterEmit: new tapable.AsyncSeriesHook(["compiler"]),
  };

  this.initPlugins();
}

Compiler.prototype.run = run;
Compiler.prototype.build = build;
Compiler.prototype.generate = generate;
Compiler.prototype.initPlugins = initPlugins;

module.exports = Compiler;
