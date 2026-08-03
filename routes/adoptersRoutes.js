/*
Idea:
- Get all CRUD operations working
- Add documentation
- Add validation to reject any missing data
 */

const { celebrate, Segments } = require('celebrate');
const adoptersBodySchema = require('../models/adoptersModel');
const adoptersController = require("../controllers/adoptersController");
const router = require('express').Router();

const validateAdopterBody = celebrate({
    [Segments.BODY]: adoptersBodySchema,
});

/**
 * @swagger
 * /adopters:
 *   get:
 *     summary: Get all adopters
 *     tags: [Adopters]
 *     responses:
 *       200:
 *         description: List of adopters
 */
// Add adopters router here
router.get('/adopters', (req, res) => {
    /*
    - Add swagger doc here
     
    */
    return adoptersController.getAlladopters(req, res);
});

/**
 * @swagger
 * /adopters/{id}:
 *   get:
 *     summary: Get an adopter by ID
 *     tags: [Adopters]
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
router.get('/adopters/:id', (req, res) => {
    return adoptersController.getSpecificAdopter(req, res);
});

/**
 * @swagger
 * /adopters:
 *   post:
 *     summary: Create an adopter
 *     tags: [Adopters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Adopter created
 */
router.post('/adopters', validateAdopterBody, (req, res) => {
    /**
     * Add swagger doc here
     */
    return adoptersController.postNewAdopter(req, res);
});

/**
 * @swagger
 * /adopters/{id}:
 *   put:
 *     summary: Update an adopter
 *     tags: [Adopters]
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
 *         description: Adopter updated
 *       404:
 *         description: Adopter not found
 */
router.put('/adopters/:id', validateAdopterBody, (req, res) => {
    return adoptersController.editAdopter(req, res);
});

/**
 * @swagger
 * /adopters/{id}:
 *   delete:
 *     summary: Delete an adopter
 *     tags: [Adopters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adopter deleted
 *       404:
 *         description: Adopter not found
 */
router.delete('/adopters/:id', (req, res) => {
    return adoptersController.deleteAdopter(req, res);
});



module.exports = router;
