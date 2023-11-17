const path = require("path");
const fs = require("fs");

function apply(compiler) {
  compiler.hooks.emit.tapAsync(
    "HtmlWebGenesisPlugin",
    (complication, callback) => {
      const outputPath = path.resolve(complication.output.path, this.filename);
      const template = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${this.title || "Document"}</title>
        </head>
        <body>
          <div #id="app"></div>
          <script defer src="${complication.output.filename}"></script>
        </body>
        </html>
      `;

      fs.writeFileSync(outputPath, template);
      callback();
    }
  );
}

function HtmlWebGenesisPlugin(config) {
  this.filename = config.filename ?? "index.html";
  this.title = config.title ?? "";
}

HtmlWebGenesisPlugin.prototype.apply = apply;

module.exports = HtmlWebGenesisPlugin;
