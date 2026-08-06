/*
Idea:
- Get all CRUD operations working
- Add documentation
- Add validation to reject any missing data
 */

const { celebrate, Segments } = require('celebrate');
const petsBodySchema = require('../models/petModel');
const petsController = require("../controllers/petsController");
const router = require('express').Router();

const validatePetBody = celebrate({
    [Segments.BODY]: petsBodySchema,
});

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Get all pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: List of pets
 */
// Add pets router here
router.get('/pets', (req, res) => {
    /*
    - Add swagger doc here
     
    */
    return petsController.getAllPets(req, res);
});

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet found
 *       404:
 *         description: Pet not found
 */
router.get('/pets/:id', (req, res) => {
    return petsController.getSpecificPet(req, res);
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a pet
 *     tags: [Pets]
 *     security:
 *       - GoogleOAuth: [profile, email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Pet created
 */
router.post('/pets', validatePetBody, (req, res) => {
    /**
     * Add swagger doc here
     */
    return petsController.postNewPet(req, res);
});

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet
 *     tags: [Pets]
 *     security:
 *       - GoogleOAuth: [profile, email]
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
 *             type: object
 *     responses:
 *       200:
 *         description: Pet updated
 *       404:
 *         description: Pet not found
 */
router.put('/pets/:id', validatePetBody, (req, res) => {
    return petsController.editPet(req, res);
});

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete a pet
 *     tags: [Pets]
 *     security:
 *       - GoogleOAuth: [profile, email]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet deleted
 *       404:
 *         description: Pet not found
 */
router.delete('/pets/:id', (req, res) => {
    return petsController.deletePet(req, res);
});



module.exports = router;
