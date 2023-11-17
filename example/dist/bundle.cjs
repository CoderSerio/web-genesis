
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
  })({"D:\\code\\fe\\plans\\web-genesis\\example\\src\\index.js":{"dependencies":{"./msg.js":"D:/code/fe/plans/web-genesis/example/src/msg.js","./data.json":"D:/code/fe/plans/web-genesis/example/src/data.json"},"code":"\"use strict\";\n\nvar _msg = _interopRequireDefault(require(\"./msg.js\"));\nvar _data = _interopRequireDefault(require(\"./data.json\"));\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\nvar data = JSON.parse(_data[\"default\"]);\n(0, _msg[\"default\"])(\"Hello \".concat(data.name, \"!!!\"));"},"D:/code/fe/plans/web-genesis/example/src/msg.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar sendMsg = function sendMsg(str) {\n  console.log(str);\n};\nvar _default = exports[\"default\"] = sendMsg;"},"D:/code/fe/plans/web-genesis/example/src/data.json":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _default = exports[\"default\"] = \"{\\r\\n  \\\"name\\\": \\\"WebGenesis\\\",\\r\\n  \\\"time\\\": \\\"2023/11/17\\\",\\r\\n  \\\"desc\\\": \\\"Hope the world will be better\\\"\\r\\n}\\r\\n\";"}}, "D:\\code\\fe\\plans\\web-genesis\\example\\src\\index.js")