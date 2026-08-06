const express = require("express");
const { body, validationResult } = require("express-validator");
const adopters = require("../controllers/adopters");

const router = express.Router();



const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: errors.array()
      });
    }

    return next();
  };
};

const adopterValidationRules = [
  body("firstName")
    .isString()
    .withMessage("First name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("First name is required."),

  body("lastName")
    .isString()
    .withMessage("Last name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required."),

  body("phone")
    .isString()
    .withMessage("Phone must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Phone is required."),

  body("address")
    .isString()
    .withMessage("Address must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Address is required."),

  body("hasOtherPets")
    .isString()
    .withMessage("hasOtherPets must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("hasOtherPets is required.")
];

const validateAdopter = validate(adopterValidationRules);

/**
 * @swagger
 * /adopters:
 *   get:
 *     summary: Get all adopters
 *     responses:
 *       200:
 *         description: List of adopters
 */
router.get("/", adopters.getAll);

/**
 * @swagger
 * /adopters/{id}:
 *   get:
 *     summary: Get one adopter by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adopter found
 *       404:
 *         description: Adopter not found
 */
router.get("/:id", adopters.getOne);

/**
 * @swagger
 * /adopters:
 *   post:
 *     summary: Create an adopter
 *     responses:
 *       201:
 *         description: Adopter created
 *       400:
 *         description: Validation failed
 */
router.post("/", validateAdopter, adopters.create);

/**
 * @swagger
 * /adopters/{id}:
 *   put:
 *     summary: Update an adopter
 *     responses:
 *       204:
 *         description: Adopter updated
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Adopter not found
 */
router.put("/:id", validateAdopter, adopters.update);

/**
 * @swagger
 * /adopters/{id}:
 *   delete:
 *     summary: Delete an adopter
 *     responses:
 *       204:
 *         description: Adopter deleted
 *       404:
 *         description: Adopter not found
 */
router.delete("/:id", adopters.remove);


module.exports = router;
