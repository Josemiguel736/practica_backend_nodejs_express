import mongoose, { Schema } from 'mongoose'

// Esquema del usuario
const productSchema = new Schema({
  name: String,
  owner: { ref: 'user', type: mongoose.Schema.Types.ObjectId },
  price: Number,
  image: {
    data: Buffer,
    contentType: String
  },
  tags: [String]
})

const Product = mongoose.model('product', productSchema)
export default Product
