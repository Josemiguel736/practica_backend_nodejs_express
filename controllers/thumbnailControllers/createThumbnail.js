import { __dirname } from '../../lib/utils.js'
import path from 'node:path'
import { Jimp } from 'jimp'

export async function createThumbnail (image, size, sizeThumbnails) {
  const route = path.join(__dirname, '..', 'public', 'uploads', image)
  const imageJimp = await Jimp.read(route)
  const imageThumbnail = imageJimp.clone()
  imageThumbnail.resize({ w: sizeThumbnails })
  imageJimp.resize({ w: size })
  await imageThumbnail.write(path.join(__dirname, '..', 'public', 'uploads', 'thumbnails', image))
  await imageJimp.write(path.join(__dirname, '..', 'public', 'uploads', image))
}
