import express from "express"
import createError from "http-errors"
import logger from "morgan"
//conexion con mongoose
import connectMongoose from "./lib/connectMongoose.js"
//controladores
import * as homeController from "./controllers/homeController.js"

//conexion con mongoose
await connectMongoose()
console.log("Conectado a Mongoose")

//creacion express
const app= express()

//configuramos como funcionaran las vistas
app.set("views","views")
app.set("view engine","ejs")

//logger de las peticiones al server
app.use(logger("dev")) 

//Rutas de la aplicacion 
app.get('/', homeController.index)

//capturador errores



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
  res.render("error")
  
})



export default app