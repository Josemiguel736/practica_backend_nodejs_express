import User from '../../models/User.js'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

export async function authJWT (req, res, next) {
  try {
    const { email, password } = req.body

    // validar datos
    if (!email || !password) {
      next(createError(400, 'Email y contraseña son obligatorios'))
      return
    }
    // normalizamos el email
    const emailNormal = email.toLowerCase()
    // busco en la base de datos el usuario en cuestión
    const user = await User.findOne({ email: emailNormal })

    // si email o contraseña son incorrectos
    if (!user || !(await user.comparePassword(password))) { // compruebo si ese usuario existe y que la contraseña concuerda con la que yo tengo registrada
      next(createError(401, 'Email o contraseña incorrectos, por favor verifique sus datos'))
      return
    }
    // Emitir JWT

    jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '20d' },
      (err, tokenJWT) => {
        if (err) {
          next(err)
          return
        }
        res.json({ tokenJWT })
      }
    )
  } catch (error) {
    next(error)
  }
}
