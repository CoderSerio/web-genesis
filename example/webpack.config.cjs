const path = require("path");

const webpack = require("../lib/index.js");

const config = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.cjs",
  },
};

webpack(config);
