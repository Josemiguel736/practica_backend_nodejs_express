# NodePop

## Deploy

### Install dependencies:

````sh
npm install
````

On first deploy copy .env.example to .env and customize environment variables
````sh
cp .env.example .env
````

Create de initial data on your first deploy with this command
````sh
npm run initDB
````
### Start:

To start in production mode

````sh
npm start
````
To start in development mode

````sh
npm run dev
````

Default users data:
````sh
email: admin@example.com
pass: admin

email: usuario@example.com
pass: usuario
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

## Justificacion del proyecto

### Funcionalidades usuarios

Nodepop permite si NO estas logueado:
- Loguear usuarios
- Crear usuarios (al crearse el usuario se normalizara su email además de crear un hash para su password, también loguea directamente al usuario registrado (siempre que se cree desde /register desde initDB debemos crearlos normalizados y hasheados desde el principio))

Nodepop permite si estas logueado:
- Crear productos (al crear los productos se normalizan los tags para evitar tags iguales con mayúsculas y minúsculas diferentes)
- Filtrar productos por: tag, nombre, precio máximo y minimo además de rango de precios 
- Borar productos (se valida que quien borra el producto sea el dueño de lo contrario lanzará un error)

### Productos
Los productos en NodePop deben:
- Tener una imágen por producto
- Contener tags
- Tener un precio
- Tener un dueño

### Imágenes de producto
Con respecto a la versión anterior de NodePop ahora las imágenes no se guardan en la base de datos, si no que se guardan en el propio servidor y en la base de datos solo guardamos una referencia a la ruta de la imagen.

