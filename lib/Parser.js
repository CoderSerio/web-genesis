const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse");
const { transformFromAst } = require("@babel/core");

function getAst(path) {
  const content = fs.readFileSync(path, "utf-8");

  const ast = parser.parse(content, {
    sourceType: "module",
  });

  return ast;
}

function getDependencies(ast, filename) {
  const dependencies = {};

  traverse.default(ast, {
    // get the node which's type is ImportDeclaration
    ImportDeclaration: ({ node }) => {
      const dirname = path.dirname(filename).split("\\").join(path.posix.sep);
      const source = node.source.value;
      const filepath = path.posix.join(dirname, source);
      dependencies[source] = filepath;
    },
  });

  return dependencies;
}

function getCode(ast) {
  const { code } = transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  return code;
}

module.exports = {
  getAst,
  getDependencies,
  getCode,
};
