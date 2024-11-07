import multer from 'multer';
import Product from "../models/Product.js";

export function index(req,res,next){
    res.render("newProduct")
}

const storage = multer.memoryStorage()
const upload = multer({ storage })
export const imageUpload = upload.single('image')

export async function postNewProduct(req,res,next){
    try{
    //recuperamos lo que nos envían con elmetodo post
    
    const {name,price,tags} = req.body
    const owner = req.session.userID    
    const image = { data: req.file.buffer,
                    contentType: req.file.mimetype
    }

   

    //tags vine como un solo string asi que lo separamos por las comas y limpiamos los espacios que haya podido dejar
    const tagList= tags.split(",").map(item =>item.trim().toLowerCase())
    //creamos el producto en memoria
    const product = new Product({name,owner,price,image,tags:tagList})
    //lo guardamos en mongoDB
    await product.save()
    //redireccionamos al home
    res.redirect("/")

}catch(err){
    //si hay un error lo capturamos y llamamos a next
    next(err)
}}