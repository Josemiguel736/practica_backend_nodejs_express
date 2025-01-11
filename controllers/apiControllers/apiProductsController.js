import Product from '../../models/Product.js'

export async function apiProductsList (req, res, next) {
  try {
    const tags = req.query.tags || 'Todos'
    const min = parseInt(req.query.min) || 0
    const max = parseInt(req.query.max) || 0
    const textSearch = req.query.name
    const limit = req.query.limit
    const sort = req.query.sort
    const skip = req.query.skip
    const fields = req.query.fields

    const filter = { }
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
    // si la busqueda es "msi" no apareceria por ejemplo "portatil msi" para hacer que buscase estrictamente habria que quitarle '^' al RegExp
    if (textSearch) {
      filter.name = new RegExp('^' + textSearch, 'i')
    }
    // buscamos cuantos productos tenemos con el filtro aplicado!!
    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.list(filter, limit, skip, sort, fields)])

    res.json({ result: products, count: totalProducts })
  } catch (error) {
    next(error)
  }
}

export async function apiProductGetOne (req, res, next) {
  try {
    const productId = req.params.productsId
    const product = await Product.findById(productId)
    res.json({ result: product })
  } catch (error) {
    next(error)
  }
}

export async function apiProductNew (req, res, next) {
  try {
    const productData = req.body

    // create instance in memory
    const product = new Product(productData)

    const tags = product.tags
    if (tags) {
      product.tags = tags[0].split(',').map(tag => tag.trim())
    }

    // upload image
    product.image = req.file?.filename

    // save in database
    const savedProduct = await product.save()

    // response
    res.status(201).json({ result: savedProduct })
  } catch (error) {
    next(error)
  }
}

export async function apiProductUpdate (req, res, next) {
  try {
    const productId = req.params.productId
    const productData = req.body
    productData.image = req.file?.filename
    const tags = productData.tags
    if (tags) {
      productData.tags = tags.split(',').map(tag => tag.trim())
    }

    const product = await Product.findByIdAndUpdate(productId, productData, { new: true })
    res.json({ result: product })
  } catch (error) {
    next(error)
  }
}

export async function apiProductDelete (req, res, next) {
  try {
    const productId = req.params.productId

    await Product.deleteOne({ _id: productId })

    res.json()
  } catch (error) {
    next(error)
  }
}
