# Práctica Backend Avanzado
## Módulo NPM publicado
- [Enlace al módulo](https://www.npmjs.com/package/sdp_validator)

### Descripción

sdp-validator es una biblioteca escrita en TypeScript para validar datos comunes como correos electrónicos, números de teléfono, tarjetas de crédito, URLs y contraseñas.


### Instalación
````sh
npm i sdp_validator
````
# NodePop

## Deploy

### Install dependencies:

````sh
npm install
````
### .env:

On first deploy copy .env.example to .env and customize environment variables.
````sh
cp .env.example .env
````

### RabbitMQ:

Dont forget add the qeue to the exchange in your RabbitMQ manager

 ### DataBase:

Create de initial data on your first deploy with this command.
````sh
npm run initDB
````
### Start:

To start in production mode IMPORTANT: Uses PM2 to init processes.

````sh
npm start
````
### Start Dev mode:
To start in development mode IMPORTANT: Uses PM2 to init the background thumbnail creation microservice.

````sh
npm run devInit
````

To start in development mode IMPORTANT: The thumbnail creation service will not start with this command, use it only if this process is already running or not required.

````sh
npm run dev
````

Default users data:
````sh
email: admin@example.com
pass: 1234

email: usuario@example.com
pass: 1234
````

## Aditionals scripts

### Clean server

Use it to clean the server of unused images and thumbnails.

````sh
npm run cleanImg
````
Use it to restart the database and clean the server of unused images and thumbnails.

````sh
npm run initDBandClean
````


### PM2
Use it to restart all processes started with PM2.

````sh
npm run restart
````

Use it to stop all processes started with PM2.

````sh
npm run stop
````
Use it to delete all processes created with PM2.

````sh
npm run delete
````
### Lint:

To see the writing errors in the code with Standard

````sh
npm run lint
````
To fix the writing errors in the code with Standard

````sh
npm run lintFix
````

## API

Base URL: http://127.0.0.1:3000/api/

### Auth
All methods of the NodePop API require authentication, you will need a JWT token.

You can use it in the request header or in the body.

POST /api/login

````json
email : yourEmail
password : yourPassword
````

````json
{
    "tokenJWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzhiOTJkZmQxM2JmZGJlZTkxOTcxZjkiLCJpYXQiOjE3MzcyMDQ4NzQsImV4cCI6MTczODkzMjg3NH0.lXdvY7H8KWHuXYTIqXl1QXEADoDZtBcnM76ko6kvsaQ"
}
````

### After auth use your JWT token in your request
In the body use
````json
jwt : yourJWTtoken
````
In the header use
````json
Authorization: yourJWTtoken
````

### Agent List 

GET api/products
````json
{
    "result": [
        {
            "_id": "67815d781c74949fcdd5be52",
            "name": "coche",
            "owner": "6730cec50038c5cfcc7a41b3",
            "price": 22,
            "image": "image-1736531320935-original.png",
            "tags": [
                "motor"
            ],
            "__v": 0
        },
        // ...
    ],
    "count": 7
}
````

You can filter using a query string.

````json
 'http://localhost:3000/api/products?tags=motor&min=100&max=2000&name=coche&limit=5&skip=1&sort=-1&fields=name'
````

````json
"name": Nombre del producto
"price": Precio del producto
"tags": Tags del producto
"sort": 1 ascendente -1 descendente
"skip": Productos a omitir
"limit": Número de productos que quieres que te devuelva
"fields": Campos que quieres que te devuelva (por defecto también incluirá el productId) 
````

### Find product by id
GET /api/products/:productsId
````json
{
    "result": 
        {
            "_id": "67815d781c74949fcdd5be52",
            "name": "coche",
            "owner": "6730cec50038c5cfcc7a41b3",
            "price": 22,
            "image": "image-1736531320935-original.png",
            "tags": [
                "motor"
            ],
            "__v": 0
        }
}
````
### Create product

POST /api/products

Important: separate the tags with commas.

````json
 "name": "Portatil MSI",
  "price": 1200,
  "image": "imagen-producto.jpg",
  "tags": "tecnología","laptop","gaming"
````

````json
{
    "result": {
        "name": "Portatil MSI",
        "price": 1200,
        "tags": [
            "tecnología",
            "laptop",
            "gaming"
        ],
        "_id": "678ba8dbb8697e74f1281a3f",
        "image": "image-1737205979227-imagen-producto.jpg",
        "owner": "678b92dfd13bfdbee91971f9",
        "__v": 0
    }
}
````
### Update product

PUT /api/products/:productId

Important: separate the tags with commas.

````json
 "name": "Portatil Asus",
  "price": 1300,
  "image": "imagen-producto.jpg",
  "tags": "tecnología","laptop","gaming","asus"
````

````json
{
    "result": {
        "_id": "678ba8dbb8697e74f1281a3f",
        "name": "Portatil Asus",
        "price": 1300,
        "tags": [
            "tecnología",
            "laptop",
            "gaming",
            "asus"
        ],
        "image": "image-1737206061218-imagen-producto.jpg",
        "owner": "678b92dfd13bfdbee91971f9",
        "__v": 0
    }
}
````
### Delete product

DELETE /api/products/:productId

````json
 status:200
````
## Web

### Funcionalidades usuarios

Nodepop permite si NO estas logueado:
- Loguear usuarios
- Crear usuarios (al crearse el usuario se normalizara su email además de crear un hash para su password, también loguea directamente al usuario registrado (siempre que se cree desde /register desde initDB debemos crearlos normalizados y hasheados desde el principio))

Nodepop permite si estas logueado:
- Crear productos (al crear los productos se normalizan los tags para evitar tags iguales con mayúsculas y minúsculas diferentes)
- Filtrar productos por: tag, nombre, paginación, precio máximo y minimo además de rango de precios 
- Borar productos (se valida que quien borra el producto sea el dueño de lo contrario lanzará un error)

### Productos
Los productos en NodePop deben:
- Tener una imágen por producto
- Contener tags
- Tener un precio
- Tener un dueño

### Imágenes de producto
Con respecto a la versión anterior de NodePop ahora las imágenes no se guardan en la base de datos, si no que se guardan en el propio servidor y en la base de datos solo guardamos una referencia a la ruta de la imagen.

Todas las imágenes subidas se reemplazan por una versión reducida (por defecto a 1000px de ancho)
También se genera una miniatura (por defecto 100px * 100px)