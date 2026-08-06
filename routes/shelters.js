const express = require("express");
const { body, validationResult } = require("express-validator");
const shelters = require("../controllers/shelters");
// const ensureAuthenticated = require("../middleware/authenticate");

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

    req.shelter = {
      name: req.body.name.trim(),
      location: {
        address: req.body.location.address.trim(),
        city: req.body.location.city.trim(),
        state: req.body.location.state.trim(),
        postal_code: req.body.location.postal_code.trim()
      },
      phone: req.body.phone.trim(),
      email: req.body.email.trim(),
      website: req.body.website.trim(),
      capacity: Number(req.body.capacity),
      operating_hours: {
        weekday: req.body.operating_hours.weekday.trim(),
        weekend: req.body.operating_hours.weekend.trim()
      }
    };

    return next();
  };
};

const shelterValidationRules = [
  body("name").trim().notEmpty().withMessage("Name is required."),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("Location address is required."),

  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("Location city is required."),

  body("location.state")
    .trim()
    .notEmpty()
    .withMessage("Location state is required."),

  body("location.postal_code")
    .trim()
    .notEmpty()
    .withMessage("Location postal code is required."),

  body("phone").trim().notEmpty().withMessage("Phone is required."),

  body("email").trim().isEmail().withMessage("A valid email is required."),

  body("website")
    .trim()
    .isURL()
    .withMessage("A valid website URL is required."),

  body("capacity")
    .isInt({ min: 0 })
    .withMessage("Capacity must be a whole number of 0 or greater."),

  body("operating_hours.weekday")
    .trim()
    .notEmpty()
    .withMessage("Weekday operating hours are required."),

  body("operating_hours.weekend")
    .trim()
    .notEmpty()
    .withMessage("Weekend operating hours are required.")
];


const validateShelter = validate(shelterValidationRules);

/**
 * @swagger
 * /shelters:
 *   get:
 *     summary: Get all shelters
 *     responses:
 *       200:
 *         description: List of shelters
 */
router.get("/", shelters.getAll);

/**
 * @swagger
 * /shelters/{id}:
 *   get:
 *     summary: Get one shelter by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shelter found
 *       404:
 *         description: Shelter not found
 */
router.get("/:id", shelters.getOne);

/**
 * @swagger
 * /shelters:
 *   post:
 *     summary: Create a shelter
 */
router.post("/", validateShelter, shelters.create);

/**
 * @swagger
 * /shelters/{id}:
 *   put:
 *     summary: Update a shelter
 */
router.put("/:id", validateShelter, shelters.update);

/**
 * @swagger
 * /shelters/{id}:
 *   delete:
 *     summary: Delete a shelter
 */
router.delete("/:id", shelters.remove);

module.exports = router;