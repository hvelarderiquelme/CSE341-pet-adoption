const { body } = require("express-validator");

const requiredString = (field) =>
  body(field)
    .exists({ values: "falsy" })
    .withMessage(`${field} is required`)
    .bail()
    .isString()
    .withMessage(`${field} must be a string`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage(`${field} cannot be empty`);

const requiredInteger = (field) =>
  body(field)
    .exists({ values: "null" })
    .withMessage(`${field} is required`)
    .bail()
    .isInt()
    .withMessage(`${field} must be an integer`)
    .toInt();

const pets = [
  ...["name", "species", "breed", "gender", "color", "vaccinated",
    "adoptionStatus", "description"].map(requiredString),
  requiredInteger("age"),
  requiredInteger("shelterId")
];

const shelters = [
  ...["name", "address", "city", "state", "zipCode", "phone", "email",
    "acceptingAnimals"].map(requiredString),
  body("email").isEmail().withMessage("email must be valid").normalizeEmail(),
  requiredInteger("capacity"),
  requiredInteger("currentAnimals")
];

const adopters = [
  ...["firstName", "lastName", "email", "phone", "address", "hasOtherPets"]
    .map(requiredString),
  body("email").isEmail().withMessage("email must be valid").normalizeEmail()
];

const applications = [
  requiredInteger("applicationDate"),
  ...["status", "reasonForAdoption"].map(requiredString),
  body("approvedBy")
    .optional({ nullable: true })
    .isString()
    .withMessage("approvedBy must be a string")
    .trim()
];

module.exports = { pets, shelters, adopters, applications };
