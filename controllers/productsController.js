import createError from 'http-errors'
import Product from '../models/Product.js'
import { __dirname, fileExists } from '../lib/utils.js'
import fs from 'node:fs/promises'
import path from 'node:path'

export function index (req, res, next) {
  res.render('newProduct')
}

export async function postNewProduct (req, res, next) {
  try {
    // recuperamos lo que nos envían con elmetodo post

    const { name, price, tags } = req.body
    const owner = req.session.userID
    const image = req.file.filename

    // tags vine como un solo string asi que lo separamos por las comas o espacios gracias a esta expresión regular y limpiamos los espacios extra que haya podido dejar
    const tagList = tags.split(/(?:,| )+/).map(item => item.trim().toLowerCase())
    // creamos el producto en memoria
    const product = new Product({ name, owner, price, image, tags: tagList })
    // lo guardamos en mongoDB
    await product.save()
    // redireccionamos al home
    res.redirect('/')
  } catch (err) {
    // si hay un error lo capturamos y llamamos a next
    next(err)
  }
}

export async function deleteProduct (req, res, next) {
  const userID = req.session.userID
  const productID = req.params.productID

  const product = await Product.findOne({ _id: productID })

  if (!product) {
    console.warn(`WARNING - el usuario ${userID} esta intentando eliminar un producto inexistente`)
    next(createError(404, 'Not found'))
    return
  }

  if (product.owner.toString() !== userID) {
    console.warn(`WARNING - el usuario ${userID} esta intentando eliminar un producto de otro usuario`)
    next(createError(401, 'Not authorized'))
    return
  }

  if (product.image) {
    const route = path.join(__dirname, '..', 'public', 'uploads')
    const routeThum = path.join(__dirname, '..', 'public', 'uploads', 'thumbnails')
    const [existImage, existThum] = await Promise.all([
      fileExists(route, product.image),
      fileExists(routeThum, product.image)
    ])

    if (existImage) {
      await fs.unlink(path.join(route, product.image))
    }
    if (existThum) {
      await fs.unlink(path.join(routeThum, product.image))
    }
  }

  await Product.deleteOne({ _id: productID })
  res.redirect('/')
}
