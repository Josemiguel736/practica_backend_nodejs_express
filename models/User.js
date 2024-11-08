import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

// Esquema del usuario
const userSchema = new Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String
})

// _____________________metodos del modelo User__________________________

// Encripta la contraseña del usuario
userSchema.statics.hashPassword = function (clearPassword) {
  return bcrypt.hash(clearPassword, 10)
}

// Compara la contraseña del usuario para ver si es correcta
userSchema.methods.comparePassword = function (clearPassword) {
  return bcrypt.compare(clearPassword, this.password)
}

const User = mongoose.model('user', userSchema)
export default User
