const path = require("path");
const HtmlWebGenesisPlugin = require("./plugins/html-web-genesis-plugin.cjs");
const webpack = require("../lib/index.js");

const config = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.cjs",
  },
  plugins: [
    new HtmlWebGenesisPlugin({
      filename: "index.html",
    }),
  ],
};

webpack(config);
