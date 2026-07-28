const createCrudController = require("./crudFactory");

module.exports = createCrudController("shelters", "Shelter", [
  "name", "address", "city", "state", "zipCode", "phone", "email",
  "capacity", "currentAnimals", "acceptingAnimals"
]);
