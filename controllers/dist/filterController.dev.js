"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listProducts = listProducts;

var _Product = _interopRequireDefault(require("../models/Product.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function listProducts(req, res, next) {
  var userID, availableTags, tags, min, max, textSearch, page, limit, sort, filter, skip, countProducts, products;
  return regeneratorRuntime.async(function listProducts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          res.locals.error = '';
          res.locals.tag = 'Todos';
          res.locals.min = 0;
          res.locals.max = 0;
          res.locals.textSearch = '';
          res.locals.limit = req.query.limit || 10; // recupero el user id

          userID = req.session.userID; // busqueda de los tags de los articulos de los que el usuario es dueño

          _context.next = 10;
          return regeneratorRuntime.awrap(_Product["default"].distinct('tags', {
            owner: userID
          }));

        case 10:
          availableTags = _context.sent;
          // Asignamos los tags a la vista
          res.locals.availableTags = availableTags; // recibimos los datos de la query

          tags = req.query.tags || 'Todos';
          min = parseInt(req.query.min) || 0;
          max = parseInt(req.query.max) || 0;
          textSearch = req.query.textSearch;
          page = req.query.page;
          limit = req.query.limit;
          sort = req.query.sort; // creamos un filtro basico con los productos de los que el usuario es propietario

          filter = {
            owner: userID
          };
          /* si tags es distinto de Todos buscamos por tags
              (Todos empieza por mayuscula porque es el único que va a poder existir así, el resto obligatoriamente van a ser en minuscula)
              ningún usuario podrá crear esa etiqueta para un producto ya que las normalizamos a minúscula antes de insertarlas en la base de datos
              */

          if (tags !== 'Todos' & tags !== undefined) {
            filter.tags = {
              $in: tags
            };
          } // filtro por precio siempre que el max o el min sean mayores que 0 creo una consulta, varia en función de que valores sean mayores que 0
          // Uso mayores que 0 para evitar valores negativos


          if (max > 0 || min >= 0) {
            if (max > 0 & min > 0) {
              filter.price = {
                $gte: min,
                $lte: max
              };
            } else if (max > 0 & min === 0) {
              filter.price = {
                $lte: max
              };
            } else if (max === 0 & min > 0) {
              filter.price = {
                $gte: min
              };
            }
          } // Si tenemos busqueda por texto le añadimos este filtro (ahora mismo busca el valor en el indice)
          // si la busqueda es "msi" no aparecera por ejemplo "portatil msi" para hacer que asi fuese habria que quitarle el '^' al RegExp


          if (textSearch) {
            filter.name = new RegExp('^' + textSearch, 'i');
          } // paginacion
          // calculamos cuanto seria el salto en funcion de la página


          skip = (page - 1) * limit; // buscamos cuantos productos tenemos

          _context.next = 26;
          return regeneratorRuntime.awrap(_Product["default"].countDocuments(filter));

        case 26:
          countProducts = _context.sent;
          // Enviaos a la vista el total de enlaces de salto de página que tiene que generar
          res.locals.totalPages = countProducts / limit; // busqueda de productos

          _context.next = 30;
          return regeneratorRuntime.awrap(_Product["default"].list(filter, limit, skip, sort));

        case 30:
          products = _context.sent;
          // asignamos las variables para poder usarlas en la vista y llamamos a next
          res.locals.products = products;
          res.locals.tag = tags;
          res.locals.min = min;
          res.locals.max = max;
          res.locals.textSearch = textSearch;
          res.locals.limit = limit;
          next();
          _context.next = 43;
          break;

        case 40:
          _context.prev = 40;
          _context.t0 = _context["catch"](0);
          next(_context.t0);

        case 43:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 40]]);
}