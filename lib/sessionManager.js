import session from "express-session";
import MongoStore from "connect-mongo";


const INACTIVITY_EXPIRATION_2_DAYS = 100*60*60*24*2

export const middelwareSession = session({
    name:"nodepop-session", //nombre de la cookie
    secret:"AEIpCDwp8fb7dNaNqdWAoR4ib7eLaO", //hash de la sesion ESTE DATO NO DEBERIA DE ESTAR PUBLICO EN GITHUB lo dejo aquí porque es una práctica y no un trabajo real
    saveUninitialized:true, //guardamos la sesion aunque no tenga datos
    resave:false, //solo se guarda si la sesion se ha actualizado
    cookie:{maxAge:INACTIVITY_EXPIRATION_2_DAYS}, 
    //guardamos la sesion en mongoDB
    store:MongoStore.create({
        mongoUrl:"mongodb://127.0.0.1:27017/nodepop"
    })
})

//enviamos la sesion a las vistas
export function userSessionInViews(req,res,next){
    res.locals.session=req.session
    next()
}

//compruebo si tiene una sesion iniciada
export function isLoggedIn(req,res,next){
    if(!req.session.userID){
        res.redirect("/login")//si no la tiene lo envio al login
        return
    }
    next()
}