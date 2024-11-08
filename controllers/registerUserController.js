import User from "../models/User.js";

export function index(req,res,next){
    res.locals.error=""
    res.locals.email=""
    res.locals.name=""
    res.render("register")
}

export async function postNewUser(req,res,next){
    try{
    //recuperamos el post y normalizamos el email para guardarlo en minusculas    
    const name = req.body.name 
    const email = req.body.email.toLowerCase()
    const password = req.body.password
    //comprobamos si ese email esta ya registrado en la base de datos
    if (await User.findOne({email})){
        res.locals.error ="Este email ya existe" //si esta registrado en la base de datos informo al usuario a través de las vistas
        res.locals.email = email
        res.locals.name = name
        res.render("register")
        return
    }

    //Si no existe ese email registro al usuario
    const user = new User(
        {userName:name,email:email,password: await User.hashPassword(password)})     
    
    await user.save()

    //Busco en la base de datos ese usuario para poder logearlo directamente  
    const userLogin= await User.findOne({email:email})
        
    //Asigno su id de usuario al req.session 
     req.session.userID = userLogin._id
     req.session.userName = userLogin.userName
    //redireccionamos al home
    res.redirect("/")

}catch(err){
    //si hay un error lo capturamos y llamamos a next
    next(err)
}}
