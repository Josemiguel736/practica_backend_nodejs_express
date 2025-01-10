"use strict";

require("dotenv/config");

var _nodeHttp = _interopRequireDefault(require("node:http"));

var _debug = _interopRequireDefault(require("debug"));

var _app = _interopRequireDefault(require("./app.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var debug = (0, _debug["default"])('nodepop:server');
var port = process.env.PORT || 3000; // creamos el servidor

var server = _nodeHttp["default"].createServer(_app["default"]);

server.on('error', function (err) {
  return console.error(err);
});
server.on('listening', function () {
  debug("Servidor arrancado en puerto ".concat(port));
});
server.listen(port);