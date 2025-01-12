import multer from 'multer'
import path from 'node:path'
import { __dirname } from './utils.js'

// configuración de almacenamiento.
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const route = path.join(__dirname, '..', 'public', 'uploads')
    callback(null, route)
  },
  filename: function (req, file, callback) {
    const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`
    callback(null, filename)
  }
})
// configuracion de upload.
const upload = multer({ storage })

export default upload
