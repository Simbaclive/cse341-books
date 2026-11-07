// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import { writeFileSync } from 'node:fs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '2.0.0',
      description: 'API for books and authors',
    },
    servers: [{ url: '/' }],
  },
  apis: ['./src/router.js'],
};

const spec = swaggerJSDoc(options);
writeFileSync('./swagger.json', JSON.stringify(spec, null, 2));
console.log('swagger.json generated');