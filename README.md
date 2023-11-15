# web-genesis
`web-genesis` is a mini-webpack for learning.

## Dependencies

There are core dependencies we use in this program:

- `@babel/core`：supply the babel APIs.
- `@babel/preset-env`：transfer JavaScript code in style of ES6+ to one of ES5.
- `@babel/parser`: analyse JavaScript code, and transfer it to AST.
- `@babel/traverse`：traverse the AST.
- `tapable`: inject code in specific stages to implement the plugin mechanism.

## Test

Change directory to `/example` and run the command below:

```shell
npm run build
```
