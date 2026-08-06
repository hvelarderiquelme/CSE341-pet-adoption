//Swagger libraries
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//load external document files
const applicationsDocs = require('../docs/applications.json');
const petDocs = require('../docs/pets.json');
const sheltersDocs = require("../docs/shelters.json");
const adoptersDocs = require('../docs/adopters.json');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Adoption API',
      version: '1.0.0',
      description: 'Interactive API documentation for the Pet Adoption API',
    },
    components: {
      securitySchemes: {
        GoogleOAuth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: process.env.GOOGLE_OAUTH_AUTH_URL || 'https://accounts.google.com/o/oauth2/v2/auth',
              tokenUrl: process.env.GOOGLE_OAUTH_TOKEN_URL || 'https://oauth2.googleapis.com/token',
              scopes: {
                profile: 'Read profile information',
                email: 'Read email address'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Pets',
        description: 'Operations and endpoints related to managing the pets inventory'
      },
      {
        name: 'Adopters',
        description: 'Operations and endpoints related to managing adopters'
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
      ...sheltersDocs,
      ...adoptersDocs
    }
  },
  // We can leave this empty since paths are manually loaded via JSON modules above
  // apis: [], 
  apis: ['./routes/pets.js', './routes/adoptersRoutes.js', './routes/shelters.js', './routes/applicationRoutes.js', './routes/auth.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = { setupSwagger };