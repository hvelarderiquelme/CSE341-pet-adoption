const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pet Adoption API",
      version: "1.0.0",
      description: "API for managing pet-adoption shelters"
    },
    servers: [
      {
        url: process.env.RENDER_EXTERNAL_URL || "http://localhost:8080"
      }
    ],
    components: {
      schemas: {
        Shelter: {
          type: "object",
          required: [
            "name",
            "address",
            "city",
            "state",
            "zipCode",
            "phone",
            "email",
            "capacity",
            "currentAnimals",
            "acceptingAnimals"
          ],
          properties: {
            name: { type: "string", example: "Happy Tails Shelter" },
            address: { type: "string", example: "123 Main Street" },
            city: { type: "string", example: "Rexburg" },
            state: { type: "string", example: "ID" },
            zipCode: { type: "string", example: "83440" },
            phone: { type: "string", example: "208-555-0142" },
            email: { type: "string", example: "info@happytails.example" },
            capacity: { type: "integer", example: 60 },
            currentAnimals: { type: "integer", example: 35 },
            acceptingAnimals: { type: "string", example: "Yes" }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

module.exports = swaggerJsdoc(options);