import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
// conexion con mongoose
import connectMongoose from './lib/connectMongoose.js'
// Manejador de sesiones
import * as sessionManager from './lib/sessionManager.js'
// controladores
import * as homeController from './controllers/homeController.js'
import * as loginContoller from './controllers/loginController.js'
import * as productsController from './controllers/productsController.js'
import * as filterController from './controllers/filterController.js'
import * as registerUserController from './controllers/registerUserController.js'
import i18n from './lib/i18nConfigure.js'
import * as langController from './controllers/langController.js'
import cookieParser from 'cookie-parser'
import upload from './lib/uploadConfigure.js'
import * as apiProductsController from './controllers/apiControllers/apiProductsController.js'
import * as authController from './controllers/apiControllers/apiAuthController.js'
import * as auth from './lib/jwtAuthMiddleware.js'
import swaggerMiddleware from './lib/swaggerMiddleware.js'
import * as sendThumbnail from './lib/sendThumbnail.js'

// conexion con mongoose
await connectMongoose()
console.log('Conectado a Mongoose')

// creacion express
const app = express()
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// configuramos como funcionaran las vistas
app.set('views', 'views')
app.set('view engine', 'ejs')

// logger de las peticiones al server
app.use(logger('dev'))

// variables comunes en las vistas de mi aplicación
app.locals.appName = 'Node Pop'

app.use(i18n.init)
app.get('/change-locale/:locale', langController.changeLocale)
app.use(sessionManager.middelwareSession, sessionManager.userSessionInViews)

// Rutas publicas de la API
app.post('/api/login', authController.authJWT)

// Rutas privadas de la API
// CRUD de productos
app.get('/api/products', auth.guard, apiProductsController.apiProductsList)
app.get('/api/products/:productsId', auth.guard, apiProductsController.apiProductGetOne)
app.post('/api/products', auth.guard, upload.single('image'), sendThumbnail.sendThumbnail, apiProductsController.apiProductNew)
app.put('/api/products/:productId', auth.guard, upload.single('image'), sendThumbnail.sendThumbnail, apiProductsController.apiProductUpdate)
app.delete('/api/products/:productId', auth.guard, apiProductsController.apiProductDelete)

// Rutas publicas de la web
app.use('/api-doc', swaggerMiddleware)
app.get('/', filterController.listProducts, homeController.index)
app.get('/login', loginContoller.index)
app.post('/login', loginContoller.postLogin)
app.get('/register', registerUserController.index)
app.post('/register', registerUserController.postNewUser)

// Paginas privadas de la web
app.get('/logout', sessionManager.isLoggedIn, loginContoller.logout)
app.get('/new/product', sessionManager.isLoggedIn, productsController.index)
app.post('/new/product', sessionManager.isLoggedIn, upload.single('image'), sendThumbnail.sendThumbnail, productsController.postNewProduct)
app.get('/product/delete/:productID', sessionManager.isLoggedIn, productsController.deleteProduct)
app.get('/public/uploads', sessionManager.isLoggedIn)

app.use((req, res, next) => {
  next(createError(404))
})

// manejador de errores
app.use((err, req, res, next) => {
  if (err.array) {
    console.log(err.array())
    err.message = 'Invalid request: ' + err.array()
      .map(e => `${e.location} ${e.type} ${e.path} ${e.msg}`)
      .join(',')
    err.status = 422
  }
  res.status(err.status || 500)

  // Error en el API, send JSON
  if (req.url.startsWith('/api/')) {
    res.json({ error: err.message })
    return
  }

  res.locals.message = err.message
  res.locals.error = process.env.NODEPOP_ENV === 'development' ? err : {}

  res.render('error')
})

export default app
