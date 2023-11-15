
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
  })({"D:\\code\\fe\\plans\\web-genesis\\example\\src\\index.js":{"dependencies":{"./msg.js":"D:/code/fe/plans/web-genesis/example/src/msg.js"},"code":"\"use strict\";\n\nvar _msg = _interopRequireDefault(require(\"./msg.js\"));\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n(0, _msg[\"default\"])(\"Hello WebGenesis!!!\");"},"D:/code/fe/plans/web-genesis/example/src/msg.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar sendMsg = function sendMsg(str) {\n  console.log(str);\n};\nvar _default = exports[\"default\"] = sendMsg;"}}, "D:\\code\\fe\\plans\\web-genesis\\example\\src\\index.js")