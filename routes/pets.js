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

// Add pets router here
router.get('/pets', (req, res) => {
    /*
    - Add swagger doc here
     
    */
    return petsController.getAllPets(req, res);
});

router.get('/pets/:id', (req, res) => {
    /*
    - Add swagger doc here
    */
    return petsController.getSpecificPet(req, res);
});


router.post('/pets', validatePetBody, (req, res) => {
    /**
     * Add swagger doc here
     */
    return petsController.postNewPet(req, res);
});

router.put('/pets/:id', validatePetBody, (req, res) => {
    /**
     * Add swagger doc here
     */
    return petsController.editPet(req, res);
});

router.delete('/pets/:id', (req, res) => {
    /**
     * Add swagger doc here
     */
    return petsController.deletePet(req, res);
});



module.exports = router;
