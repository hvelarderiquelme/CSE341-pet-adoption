const express = require("express");
const { body, validationResult } = require("express-validator");
const shelters = require("../controllers/shelters");

const router = express.Router();

const validateShelter = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("address").trim().notEmpty().withMessage("Address is required."),
  body("city").trim().notEmpty().withMessage("City is required."),
  body("state").trim().notEmpty().withMessage("State is required."),
  body("zipCode").trim().notEmpty().withMessage("Zip code is required."),
  body("phone").trim().notEmpty().withMessage("Phone is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("capacity")
    .isInt({ min: 0 })
    .withMessage("Capacity must be a whole number of 0 or greater."),
  body("currentAnimals")
    .isInt({ min: 0 })
    .withMessage("Current animals must be a whole number of 0 or greater."),
  body("acceptingAnimals")
    .trim()
    .notEmpty()
    .withMessage("Accepting animals is required."),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: errors.array()
      });
    }

    req.shelter = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      phone: req.body.phone,
      email: req.body.email,
      capacity: Number(req.body.capacity),
      currentAnimals: Number(req.body.currentAnimals),
      acceptingAnimals: req.body.acceptingAnimals
    };

    return next();
  }
];

//GET ALL
/**
 * @swagger
 * /shelters:
 *   get:
 *     summary: Get all shelters
 *     responses:
 *       200:
 *         description: List of shelters
 *       500:
 *         description: Server error
 */
router.get("/", shelters.getAll);

//GET ONE
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
 *       400:
 *         description: Invalid shelter ID
 *       404:
 *         description: Shelter not found
 *       500:
 *         description: Server error
 */
router.get("/:id", shelters.getOne);

//POST
/**
 * @swagger
 * /shelters:
 *   post:
 *     summary: Create a shelter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shelter'
 *     responses:
 *       201:
 *         description: Shelter created
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post("/", validateShelter, shelters.create);


//PUT
/**
 * @swagger
 * /shelters/{id}:
 *   put:
 *     summary: Update a shelter
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shelter'
 *     responses:
 *       204:
 *         description: Shelter updated
 *       400:
 *         description: Invalid ID or validation failed
 *       404:
 *         description: Shelter not found
 *       500:
 *         description: Server error
 */
router.put("/:id", validateShelter, shelters.update);


//DELETE
/**
 * @swagger
 * /shelters/{id}:
 *   delete:
 *     summary: Delete a shelter
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Shelter deleted
 *       400:
 *         description: Invalid shelter ID
 *       404:
 *         description: Shelter not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", shelters.remove);

module.exports = router;