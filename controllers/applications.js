const createCrudController = require("./crudFactory");

module.exports = createCrudController("applications", "Application", [
  "applicationDate", "status", "reasonForAdoption", "approvedBy"
]);
