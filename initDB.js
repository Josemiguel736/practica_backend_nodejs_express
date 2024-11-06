import connectMongoose from "./lib/connectMongoose.js";
import readline from "node:readline"
import User from "./models/User.js"

//creamos una conexion a la base de datos
const conection = connectMongoose()
console.log("Conected to Mongoose")

const questionResponse = await ask("Are you sure you want to drop the database and create an initial database? (yes) to confirm another answer to deny ")
if (questionResponse.toLowerCase()!=="yes"){
    console.log("Operation aborted")
    process.exit()
}

await initUsers()

async function initUsers(params) {
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