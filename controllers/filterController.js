import Product from "../models/Product.js";

export async function listProducts(req,res,next) {
    try {
        //recibimos los tags de la query
        const tags = req.query.tags ? req.query.tags.split(",") : []
        //me guardo el user id
        const userID= req.session.userID
        
        //filtramos por los productos de los que el usuario es propietario
        let filter = {owner:userID};

        //si tags es mayor que 0 lo añadimos al filtro
        if(tags.length > 0){        
        filter.tags = { $in: tags }}        
    
    //busqueda de productos
    const products = await Product.find(filter);
    //busqueda de los tags de los articulos de los que el usuario es dueño
    const availableTags = await Product.distinct("tags",{owner:userID})
    //asignamos las variables para poder usarlas en la vista y llamamos a next
    res.locals.products=products
    res.locals.availableTags=availableTags
    next()
    } catch (error) {
        next(error)
    }
    
}