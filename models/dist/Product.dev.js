'use strict'

function _typeof (obj) { if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

const _mongoose = _interopRequireWildcard(require('mongoose'))

function _getRequireWildcardCache () { if (typeof WeakMap !== 'function') return null; const cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache () { return cache }; return cache }

function _interopRequireWildcard (obj) { if (obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { default: obj } } const cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj) } const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj.default = obj; if (cache) { cache.set(obj, newObj) } return newObj }

const productSchema = new _mongoose.Schema({
  name: String,
  owner: {
    ref: 'user',
    type: _mongoose.default.Schema.Types.ObjectId
  },
  price: Number,
  image: String,
  tags: [String]
})
productSchema.index({
  owner: 1
})
productSchema.index({
  tags: 1
})
productSchema.index({
  price: 1
})
productSchema.index({
  name: 'text'
})
productSchema.index({
  owner: 1,
  tags: 1
})
productSchema.index({
  owner: 1,
  price: 1
})

const Product = _mongoose.default.model('product', productSchema)

const _default = Product
exports.default = _default
