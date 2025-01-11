import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export function guard (req, res, next) {
  try {
    // recoger el jwt de la cabecera, query o body
    const jwtToken = req.get('Authorization') || req.query.jwt || req.body.jwt
    // Si no tengo token mando un error
    if (!jwtToken) {
      next(createError(401), 'No token provided')
      return
    }

    // Compruebo que el token es valido

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        next(createError(401, 'Invalid token'))
        return
      }
      req.apiUserId = payload._id
      next()
    })
  } catch (error) {
    next(error)
  }
}
