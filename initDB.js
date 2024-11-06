import connectMongoose from "./lib/connectMongoose.js";
import readline from "node:readline"
import User from "./models/User.js"
import Product from "./models/Product.js"

//creamos una conexion a la base de datos
const conection = connectMongoose()
console.log("Conected to Mongoose")

const questionResponse = await ask("Are you sure you want to drop the database and create an initial database? (yes) to confirm another answer to deny ")
if (questionResponse.toLowerCase()!=="yes"){
    console.log("Operation aborted")
    process.exit()
}

await initUsers()
await initProducts()

async function initUsers() {
    //Eliminamos los usuarios iniciales
    const deleteResult = await User.deleteMany()
    console.log("deleted "+ deleteResult.deletedCount + " Users") 

    //Creamos los nuevos usuarios
    const insertResult = await User.insertMany([
        {userName:"Admin",email:"admin@example.com",password: await User.hashPassword("admin")},
        {userName:"Usuario",email:"usuario@example.com",password: await User.hashPassword("usuario")}
    ])
    console.log(`insert ${insertResult.length} Users`)

}

async function initProducts() {
    //Eliminamos los productos iniciales
    const deleteResult = await Product.deleteMany()
    console.log("deleted "+ deleteResult.deletedCount + " Products") 

    //Buscamos los usuarios que serán dueños de los productos
    const [admin,user] = await Promise.all([
        User.findOne({email:"admin@example.com"}),
        User.findOne({email:"usuario@example.com"})
        ])


    //Creamos los nuevos productos
    const insertResult = await Product.insertMany([
        {   name:"Seat Cupra",
            owner:user._id,
            price:1500,
            image:"Imagen de un cupra",
            tags:["motor","lifestyle"]
        },
        {   name:"Voge 125R",
            owner:user._id,
            price:1500,
            image:"Imagen de una moto",
            tags:["motor","lifestyle","Motocicletas"]
        }

    ])
    console.log(`insert ${insertResult.length} Products`)

}


function ask (questionText){
    return new Promise((resolve,reject)=>{
        const consoleInterface = readline.createInterface({
            input:process.stdin,
            output:process.stdout
        })
        consoleInterface.question(questionText,answer=>{
            consoleInterface.close()
            resolve(answer)
        })
    })
}