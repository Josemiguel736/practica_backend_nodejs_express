import 'dotenv/config'
import connectMongoose from './lib/connectMongoose.js'
import fs from 'node:fs/promises'
import Product from './models/Product.js'
import path from 'node:path'
import readline from 'node:readline'
export async function cleanImages () {
  const products = await Product.list(null, null, null, null, 'image')
  const imagesInUse = []
  products.forEach(product => {
    imagesInUse.push(product.image)
  })
  const route = path.join(import.meta.dirname, 'public', 'uploads')
  const routeThum = path.join(import.meta.dirname, 'public', 'uploads', 'thumbnails')
  const [thumbnails, images] = await Promise.all(
    [fs.readdir(routeThum),
      fs.readdir(route)])

  for (const image of images) {
    if (!imagesInUse.includes(image) && image !== '.gitignore' && image !== 'thumbnails') {
      await fs.unlink(path.join(route, image), err => {
        console.log(err)
      },
      console.log(image + ' deleted'))
    }
  }

  for (const thum of thumbnails) {
    if (!imagesInUse.includes(thum) && thum !== '.gitignore') {
      await fs.unlink(path.join(routeThum, thum), err => {
        console.log(err)
      },
      console.log(thum + ' deleted'))
    }
  }
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

connectMongoose()
console.log('Conected to Mongoose')

const questionResponse = await ask('Are you sure you want to clean not used images? (yes) to confirm another answer to deny ')
if (questionResponse.toLowerCase() !== 'yes') {
  console.log('Operation aborted')
  process.exit()
}

console.log('Cleaning images...')

await cleanImages()

console.log('Images cleaned')

process.exit()
