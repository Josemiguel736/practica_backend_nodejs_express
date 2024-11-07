import User from "../models/User.js";

export function index(req,res,next){
    res.locals.error=""
    res.locals.email=""
    res.render("login")
}

export async function postLogin(req,res,next){
    try{
        //busco en la base de datos el usuario en cuestión
       
        const {email,password} = req.body
        
        const user = await User.findOne({email})
        
        console.log(user)
        //si email o contraseña son incorrectos 
        if(!user || !(await user.comparePassword(password))){ //compruebo si ese usuario existe y que la contraseña especificada ademas concuerda con la que yo tengo registrada
            res.locals.email=email //Mantengo el email especificado por el usuario en la vista
            res.locals.error="Email o contraseña incorrectos, por favor verifique sus datos"
            res.render("login") //lo vuelvo a enviar al login
            return 
        }
        //Asigno su id de usuario al req.session para poder usarlo más adelante
        req.session.userID = user._id
        //redirijo al home
        console.log(user._id)
        res.redirect("/")
    } catch(error){
        next(error) //si hay un error llamo a next para que se ocupe
    }
}

export function logout(req,res,next){
    req.session.regenerate(err=>{
        if(err)return next(err)
        res.redirect("/")
    })
}
