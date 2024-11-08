import Product from "../models/Product.js";

export async function listProducts(req,res,next) {
    try {
        res.locals.error=""
        res.locals.tag="Todos"
        res.locals.min=0
        res.locals.max=0
        //recupero el user id
        const userID= req.session.userID       

        //busqueda de los tags de los articulos de los que el usuario es dueño
        const availableTags = await Product.distinct("tags",{owner:userID})
        //Asignamos los tags a la vista
        res.locals.availableTags=availableTags

        //recibimos los tags de la query
        const tags = req.query.tags 
        const min = parseInt(req.query.min)
        const max = parseInt(req.query.max)      
        
        //creamos un filtro basico con los productos de los que el usuario es propietario
        let filter = {owner:userID};

  
        /*si tags es distinto de Todos buscamos por tags 
        (Todos empieza por mayuscula porque es el único que va a poder existir así, el resto obligatoriamente van a ser en minuscula)
        ningún usuario podrá crear esa etiqueta para un producto ya que las normalizamos a minúscula antes de insertarlas en la base de datos
        */
        if(tags !== "Todos"){        
        filter.tags = { $in: tags }} 
        
        //filtro por precio siempre que el max o el min sean mayores que 0 creo una consulta, varia en función de que valores sean mayores que 0 
        //Uso mayores que 0 para evitar valores negativos       
        if (max>0 || min>=0){
            if(max>0 & min>0){
                filter.price= {'$gte': min, '$lte': max }
            }else if (max>0 & min===0){
                filter.price= {'$lte': max } 
            }else if (max===0 & min<0){
                filter.price= {'$gte': min } }                 
                
            } 
    //busqueda de productos
     const products = await Product.find(filter);

    //asignamos las variables para poder usarlas en la vista y llamamos a next
    res.locals.products=products
    
    next()
    } catch (error) {
        next(error)
    }
    
}