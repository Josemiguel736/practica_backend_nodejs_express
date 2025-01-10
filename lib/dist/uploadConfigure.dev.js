'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

const _multer = _interopRequireDefault(require('multer'))

const _nodePath = _interopRequireDefault(require('node:path'))

const _utils = require('./utils.js')

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

const storage = _multer.default.diskStorage({
  destination: function destination (req, file, callback) {
    const route = _nodePath.default.join(_utils.__dirname, '..', 'public', 'uploads')

    callback(null, route)
  },
  filename: function filename (req, file, callback) {
    const filename = ''.concat(file.fieldname, '-').concat(Date.now(), '-').concat(file.originalname)
    callback(null, filename)
  }
}) // configuracion de upload.

const upload = (0, _multer.default)({
  storage
})
const _default = upload
exports.default = _default
