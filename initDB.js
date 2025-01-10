import 'dotenv/config'
import connectMongoose from './lib/connectMongoose.js'
import readline from 'node:readline'
import fs from 'node:fs'
import path from 'node:path'
import User from './models/User.js'
import Product from './models/Product.js'

// creamos una conexion a la base de datos
connectMongoose()
console.log('Conected to Mongoose')

const questionResponse = await ask('Are you sure you want to drop the database and create an initial database? (yes) to confirm another answer to deny ')
if (questionResponse.toLowerCase() !== 'yes') {
  console.log('Operation aborted')
  process.exit()
}

await initUsers()
await initProducts()

async function initUsers () {
  // Eliminamos los usuarios iniciales
  const deleteResult = await User.deleteMany()
  console.log('deleted ' + deleteResult.deletedCount + ' Users')

  // Creamos los nuevos usuarios
  const insertResult = await User.insertMany([
    { userName: 'Admin', email: 'admin@example.com', password: await User.hashPassword('admin') },
    { userName: 'Usuario', email: 'usuario@example.com', password: await User.hashPassword('usuario') }
  ])
  console.log(`insert ${insertResult.length} Users`)
}

async function initProducts () {
  // Eliminamos los productos iniciales
  const deleteResult = await Product.deleteMany()
  console.log('deleted ' + deleteResult.deletedCount + ' Products')

  // Buscamos los usuarios que serán dueños de los productos
  const [admin, user] = await Promise.all([
    User.findOne({ email: 'admin@example.com' }),
    User.findOne({ email: 'usuario@example.com' })
  ])

  // rutas de las imagenes
  const __dirname = (path.dirname(new URL(import.meta.url).pathname)).substring(3)

  const imageCupra = path.join(__dirname, './img/initDbImages/seat-leon-cupra.jpg')
  const imageBufferCupra = fs.readFileSync(imageCupra)

  const imageVoge = path.join(__dirname, './img/initDbImages/voge.jpg')
  const imageBufferVoge = fs.readFileSync(imageVoge)

  const imageMsi = path.join(__dirname, './img/initDbImages/msi.jpg')
  const imageBufferMsi = fs.readFileSync(imageMsi)

  const imageWay = path.join(__dirname, './img/initDbImages/cesta-navidad.jpg')
  const imageBufferWay = fs.readFileSync(imageWay)

  // Creamos los nuevos productos
  const insertResult = await Product.insertMany([
    {
      name: 'Seat Leon Cupra',
      owner: user._id,
      price: 15000,
      image: {
        data: imageBufferCupra,
        contentType: 'image/jpeg'
      },
      tags: ['motor', 'lifestyle']
    },
    {
      name: 'Voge 125R',
      owner: user._id,
      price: 3000,
      image: {
        data: imageBufferVoge,
        contentType: 'image/jpeg'
      },
      tags: ['motor', 'lifestyle', 'Motocicletas']
    },
    {
      name: 'Cesta de navidad ',
      owner: admin._id,
      price: 150,
      image: {
        data: imageBufferWay,
        contentType: 'image/jpeg'
      },
      tags: ['lifestyle', 'comida']
    },
    {
      name: 'Ordenador MSI',
      owner: admin._id,
      price: 1200,
      image: {
        data: imageBufferMsi,
        contentType: 'image/jpeg'
      },
      tags: ['pc', 'portatil']
    }

  ])
  console.log(`insert ${insertResult.length} Products`)
}

function ask (questionText) {
  return new Promise((resolve, reject) => {
    const consoleInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    consoleInterface.question(questionText, answer => {
      consoleInterface.close()
      resolve(answer)
    })
  })
}
