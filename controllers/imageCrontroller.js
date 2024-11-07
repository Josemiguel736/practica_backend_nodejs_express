import Product from "../models/Product.js"
 
 async function getImage(req,res,next){
    try {
        const product = await Product.findById(req.params.id)

        if(!product || !product.image){
            res.locals.errorIMG=
            res.set('Content-Type', "image/jpeg")
            res.send("./img/notFound/image-not-found.jpg")
            return
        }

        res.set('Content-Type', product.image.contentType)
        res.send(product.image.data)


    } catch (error) {
        next(error)
    }

 }

 export default getImage