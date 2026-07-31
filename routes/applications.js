const express = require('express');
const { body, validationResult } = require('express-validator');
const applicationsController = require('../controllers/applicationsController');

const router = express.Router();

// Validation helper middleware
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};

// Route validation rules
const applicationValidationRules = [
    body('adopter_id').isMongoId().withMessage('adopter_id must be a valid Mongo ID'),
    body('pet_id').isMongoId().withMessage('pet_id must be a valid Mongo ID'),
    body('shelter_id').isMongoId().withMessage('shelter_id must be a valid Mongo ID'),
    body('status').isIn(['Pending', 'Approved', 'Rejected', 'pending', 'approved', 'rejected']).withMessage('status must be pending, approved, or rejected'),
    body('submission_date').isISO8601().withMessage('submission_date must be a valid ISO8601 date'),
    body('notes').optional().isString().withMessage('notes must be a string')
];

const applicationUpdateValidationRules = [
    body('adopter_id').optional().isMongoId().withMessage('adopter_id must be a valid Mongo ID'),
    body('pet_id').optional().isMongoId().withMessage('pet_id must be a valid Mongo ID'),
    body('shelter_id').optional().isMongoId().withMessage('shelter_id must be a valid Mongo ID'),
    body('status').optional().isIn(['Pending', 'Approved', 'Rejected', 'pending', 'approved', 'rejected']).withMessage('status must be pending, approved, or rejected'),
    body('submission_date').optional().isISO8601().withMessage('submission_date must be a valid ISO8601 date'),
    body('notes').optional().isString().withMessage('notes must be a string')
];

// Add application router paths
router.get('/applications', (req, res) => {
    applicationsController.getAllApplications(req, res);
});

router.get('/applications/:id', (req, res) => {
    applicationsController.getSpecificApplication(req, res);
});

router.post('/applications', validate(applicationValidationRules), (req, res) => {
    applicationsController.postNewApplication(req, res);
});

router.put('/applications/:id', validate(applicationUpdateValidationRules), (req, res) => {
    applicationsController.editApplication(req, res);
});

router.delete('/applications/:id', (req, res) => {
    applicationsController.deleteApplication(req, res);
});

module.exports = router;
