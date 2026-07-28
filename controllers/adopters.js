const createCrudController = require("./crudFactory");

module.exports = createCrudController("adopters", "Adopter", [
  "firstName", "lastName", "email", "phone", "address", "hasOtherPets"
]);
