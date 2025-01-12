import mongoose, { Schema } from 'mongoose'

// Esquema del producto
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

productSchema.statics.list = function (filter, limit, skip, sort, fields) {
  const query = Product.find(filter)
  query.limit(limit)
  query.skip(skip)
  query.sort(sort)
  query.select(fields)
  return query.exec()
}
const Product = mongoose.model('product', productSchema)
export default Product
