const createCrudController = require("./crudFactory");

module.exports = createCrudController("pets", "Pet", [
  "name", "species", "breed", "age", "gender", "color", "vaccinated",
  "adoptionStatus", "shelterId", "description"
]);
