const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse");
const { transformFromAst } = require("@babel/core");
