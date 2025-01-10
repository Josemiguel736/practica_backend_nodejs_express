'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.index = index
exports.postNewProduct = postNewProduct
exports.deleteProduct = deleteProduct

const _httpErrors = _interopRequireDefault(require('http-errors'))

const _Product = _interopRequireDefault(require('../models/Product.js'))

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

function index (req, res, next) {
  res.render('newProduct')
}

function postNewProduct (req, res, next) {
  let _req$body, name, price, tags, owner, image, tagList, product

  return regeneratorRuntime.async(function postNewProduct$ (_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0
          // recuperamos lo que nos envían con elmetodo post
          _req$body = req.body, name = _req$body.name, price = _req$body.price, tags = _req$body.tags
          owner = req.session.userID
          image = req.file.filename // tags vine como un solo string asi que lo separamos por las comas o espacios gracias a esta expresión regular y limpiamos los espacios extra que haya podido dejar

          tagList = tags.split(/(?:,| )+/).map(function (item) {
            return item.trim().toLowerCase()
          }) // creamos el producto en memoria

          product = new _Product.default({
            name,
            owner,
            price,
            image,
            tags: tagList
          }) // lo guardamos en mongoDB

          _context.next = 8
          return regeneratorRuntime.awrap(product.save())

        case 8:
          // redireccionamos al home
          res.redirect('/')
          _context.next = 14
          break

        case 11:
          _context.prev = 11
          _context.t0 = _context.catch(0)
          // si hay un error lo capturamos y llamamos a next
          next(_context.t0)

        case 14:
        case 'end':
          return _context.stop()
      }
    }
  }, null, null, [[0, 11]])
}

function deleteProduct (req, res, next) {
  let userID, productID, product
  return regeneratorRuntime.async(function deleteProduct$ (_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userID = req.session.userID
          productID = req.params.productID
          _context2.next = 4
          return regeneratorRuntime.awrap(_Product.default.findOne({
            _id: productID
          }))

        case 4:
          product = _context2.sent

          if (product) {
            _context2.next = 9
            break
          }

          console.warn('WARNING - el usuario '.concat(userID, ' esta intentando eliminar un producto inexistente'))
          next((0, _httpErrors.default)(404, 'Not found'))
          return _context2.abrupt('return')

        case 9:
          if (!(product.owner.toString() !== userID)) {
            _context2.next = 13
            break
          }

          console.warn('WARNING - el usuario '.concat(userID, ' esta intentando eliminar un producto de otro usuario'))
          next((0, _httpErrors.default)(401, 'Not authorized'))
          return _context2.abrupt('return')

        case 13:
          _context2.next = 15
          return regeneratorRuntime.awrap(_Product.default.deleteOne({
            _id: productID
          }))

        case 15:
          res.redirect('/')

        case 16:
        case 'end':
          return _context2.stop()
      }
    }
  })
}
