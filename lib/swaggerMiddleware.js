import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nodepop API',
      version: '1.0.0',
      description: 'API para la práctica de Nodepop',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'apiKey', // Cambiado a apiKey
          name: 'Authorization', // Nombre del encabezado donde se espera el token
          in: 'header', // Ubicación del token (en los encabezados)
          description: 'JWT Authorization header. Example: "Authorization: Bearer {token}"',
        },
      },
    },
    security: [
      { BearerAuth: [] }, // Aplicación global del esquema de seguridad
    ],
  },
  apis: ['./swagger.yaml'], // Ruta a tus especificaciones adicionales
};

const specification = swaggerJSDoc(options);

export default [swaggerUi.serve, swaggerUi.setup(specification)];
