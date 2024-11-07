import Product from "../models/Product.js"

export async function index(req,res,next){
        const userID = req.session.userID
        if(userID){
            res.locals.products = await Product.find({owner:userID})
        }
        console.log(await Product.find({owner:userID}))
        res.render('index')

}