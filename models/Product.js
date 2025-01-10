import mongoose, { Schema } from 'mongoose'

// Esquema del usuario
const productSchema = new Schema({
  name: String,
  owner: { ref: 'user', type: mongoose.Schema.Types.ObjectId },
  price: Number,
  image: String,
  tags: [String]
})

productSchema.index({ owner: 1 })
productSchema.index({ tags: 1 })
productSchema.index({ price: 1 })
productSchema.index({ name: 'text' })
productSchema.index({ owner: 1, tags: 1 })
productSchema.index({ owner: 1, price: 1 })

const Product = mongoose.model('product', productSchema)
export default Product
