//Swagger libraries
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//load external document files
const applicationsDocs = require('../docs/applications.json');
const petDocs = require('../docs/pets.json');
const sheltersDocs = require("../docs/shelters.json");

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'Interactive API documentation for managing contacts',
    },
    tags: [
      {
        name: 'Pets',
        description: 'Operations and endpoints related to managing the pets inventory'
      },
      {
        name: 'Applications',
        description: 'Operations and endpoints related to managing applications to adopt pets'
      }
    ],
    servers: [
      {
        url: '/', 
        description: 'Current environment',
      },
    ],
    // Tell Swagger to inject your clean JSON path definitions here
    paths: {
      ...petDocs,
      ...applicationsDocs,
      ...sheltersDocs
    }
  },
  // We can leave this empty since paths are manually loaded via JSON modules above
  // apis: [], 
  apis: []
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = { setupSwagger };