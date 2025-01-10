import Product from '../models/Product.js'

export async function listProducts (req, res, next) {
  try {
    res.locals.error = ''
    res.locals.tag = 'Todos'
    res.locals.min = 0
    res.locals.max = 0
    res.locals.textSearch = ''
    res.locals.limit = req.query.limit || 10
    // recupero el user id
    const userID = req.session.userID

    // busqueda de los tags de los articulos de los que el usuario es dueño
    const availableTags = await Product.distinct('tags', { owner: userID })
    // Asignamos los tags a la vista
    res.locals.availableTags = availableTags

    // recibimos los datos de la query
    const tags = req.query.tags || 'Todos'
    const min = parseInt(req.query.min) || 0
    const max = parseInt(req.query.max) || 0
    const textSearch = req.query.textSearch
    const page = req.query.page
    const limit = req.query.limit
    const sort = req.query.sort

    // creamos un filtro basico con los productos de los que el usuario es propietario
    const filter = { owner: userID }

    /* si tags es distinto de Todos buscamos por tags
        (Todos empieza por mayuscula porque es el único que va a poder existir así, el resto obligatoriamente van a ser en minuscula)
        ningún usuario podrá crear esa etiqueta para un producto ya que las normalizamos a minúscula antes de insertarlas en la base de datos
        */
    if (tags !== 'Todos' & tags !== undefined) {
      filter.tags = { $in: tags }
    }

    // filtro por precio siempre que el max o el min sean mayores que 0 creo una consulta, varia en función de que valores sean mayores que 0
    // Uso mayores que 0 para evitar valores negativos
    if (max > 0 || min >= 0) {
      if (max > 0 & min > 0) {
        filter.price = { $gte: min, $lte: max }
      } else if (max > 0 & min === 0) {
        filter.price = { $lte: max }
      } else if (max === 0 & min > 0) {
        filter.price = { $gte: min }
      }
    }
    // Si tenemos busqueda por texto le añadimos este filtro (ahora mismo busca el valor en el indice)
    // si la busqueda es "msi" no aparecera por ejemplo "portatil msi" para hacer que asi fuese habria que quitarle el '^' al RegExp
    if (textSearch) {
      filter.name = new RegExp('^' + textSearch, 'i')
    }

    // paginacion
    // calculamos cuanto seria el salto en funcion de la página
    const skip = (page - 1) * limit
    // buscamos cuantos productos tenemos
    const countProducts = await Product.countDocuments(filter)
    // Enviaos a la vista el total de enlaces de salto de página que tiene que generar
    res.locals.totalPages = countProducts / limit

    // busqueda de productos
    const products = await Product.list(filter, limit, skip, sort)

    // asignamos las variables para poder usarlas en la vista y llamamos a next
    res.locals.products = products
    res.locals.tag = tags
    res.locals.min = min
    res.locals.max = max
    res.locals.textSearch = textSearch
    res.locals.limit = limit

    next()
  } catch (error) {
    next(error)
  }
}
