import Product from '../models/Product.js'

async function getImage (req, res, next) {
  try {
    // buscamos el producto al que hace referencia el ID que nos han enviado
    const product = await Product.findById(req.params.id)
    // Si ese producto o la imagen del producto no existen respondo con una imágen personalizada de NOT FOUND
    if (!product || !product.image) {
      res.set('Content-Type', 'image/jpeg')
      res.send('./img/notFound/image-not-found.jpg')
      return
    }
    // Si existen las sirvo
    res.set('Content-Type', product.image.contentType)
    res.send(product.image.data)
  } catch (error) {
    next(error)
  }
}

export default getImage
