import express from "express"
import createError from "http-errors"
import logger from "morgan"
//conexion con mongoose
import connectMongoose from "./lib/connectMongoose.js"
//Manejador de sesiones
import * as sessionManager from "./lib/sessionManager.js"
//controladores
import * as homeController from "./controllers/homeController.js"
import * as loginContoller from "./controllers/loginController.js"
import * as productsController from "./controllers/productsController.js"

//conexion con mongoose
await connectMongoose()
console.log("Conectado a Mongoose")

//creacion express
const app= express()
app.use(express.json())
app.use(express.urlencoded())

//configuramos como funcionaran las vistas
app.set("views","views")
app.set("view engine","ejs")

//logger de las peticiones al server
app.use(logger("dev")) 

//variables comunes en las vistas de mi aplicación
app.locals.appName ="Node Pop"

app.use(sessionManager.middelwareSession,sessionManager.userSessionInViews)
//Rutas PUBLICAS de la aplicacion 
app.get('/', homeController.index)
app.get('/login', loginContoller.index)
app.post('/login', loginContoller.postLogin)


//Paginas privadas 
app.get("/logout",sessionManager.isLoggedIn,loginContoller.logout)
app.get("/new/product",sessionManager.isLoggedIn,productsController.index)
app.post("/new/product",sessionManager.isLoggedIn,productsController.imageUpload,productsController.postNewProduct)



//manejador de errores
app.use((err,req,res,next)=>{
  if(err.array){
    console.log(err.array())
    err.message="Invalid request: " + err.array()
    .map(e=>`${e.location} ${e.type} ${e.path} ${e.msg}`)
    .join(",")
    err.status=422
  }
  res.status(err.status || 500)
  
  res.locals.message=err.message
  res.locals.error=process.env.NODEPOP_ENV==="development" ? err:{}
  
  res.render("error")
})





export default app