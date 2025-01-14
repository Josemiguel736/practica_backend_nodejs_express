import Product from '../../models/Product.js'
import createError from 'http-errors'
import { __dirname, fileExists } from '../../lib/utils.js'
import fs from 'node:fs/promises'
import path from 'node:path'
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

    const filter = { owner: req.apiUserId }
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
    const product = await Product.findOne({ _id: productId, owner: req.apiUserId })
    res.json({ result: product })
  } catch (error) {
    next(error)
  }
}

export async function apiProductNew (req, res, next) {
  try {
    const productData = req.body

    const product = new Product(productData)

    const tags = product.tags
    if (tags.length > 0) {
      product.tags = tags[0].split(',').map(tag => tag.trim())
    }

    product.image = req.file?.filename
    product.owner = req.apiUserId

    const savedProduct = await product.save()

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

    const product = await Product.findOneAndUpdate({ _id: productId, owner: req.apiUserId }, productData, { new: true })
    res.json({ result: product })
  } catch (error) {
    next(error)
  }
}

export async function apiProductDelete (req, res, next) {
  try {
    const productId = req.params.productId

    const product = await Product.findOne({ _id: productId }).exec()

    if (!product) {
      console.warn(`WARNING: El usuario ${req.apiUserId} intenta borrar un producto que no existe`)
      return next(createError(404, 'Product not found'))
    }
    if (product.owner.toString() !== req.apiUserId) {
      console.warn(`WARNING: El usuario ${req.apiUserId} intenta borrar el producto ${productId} que no es de su propiedad`)
      return next(createError(403, 'Forbidden'))
    }

  if (product.image) {
    const route = path.join(__dirname, '..', 'public', 'uploads')
    const routeThum = path.join(__dirname, '..', 'public', 'uploads', 'thumbnails')
    const [existImage, existThum] = await Promise.all([
      fileExists(route, product.image),
      fileExists(routeThum, product.image)
    ])

    if (existImage){
      await fs.unlink(path.join(route, product.image))
    }
    if (existThum){
      await fs.unlink(path.join(routeThum, product.image))
    }
  }

    await Product.deleteOne({ _id: productId })

    res.json()
  } catch (error) {
    next(error)
  }
}
