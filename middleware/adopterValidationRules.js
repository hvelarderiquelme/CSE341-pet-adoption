const { body } = require('express-validator');

const adopterValidationRules = [
  // Root level fields
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string'),

  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Phone must match format: 403-555-0411'),

  // Location nested object
  body('location.city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('location.state')
    .trim()
    .notEmpty().withMessage('State/Province is required')
    .isLength({ min: 2, max: 2 }).withMessage('State must be a 2-letter abbreviation'),

  body('location.postal_code')
    .trim()
    .notEmpty().withMessage('Postal code is required'),

  // Preferences nested object
  body('preferences.preferred_species')
    .isArray({ min: 1 }).withMessage('Preferred species must be an array with at least one item'),

  body('preferences.preferred_species.*')
    .isString().withMessage('Each species item must be a string'),

  body('preferences.preferred_size')
    .trim()
    .notEmpty().withMessage('Preferred size is required')
    .isIn(['Small', 'Medium', 'Large', 'Extra Large']).withMessage('Invalid size category'),

  body('preferences.max_age')
    .isInt({ min: 0 }).withMessage('Max age must be a positive integer'),

  // Household Info nested object
  body('household_info.housing_type')
    .trim()
    .notEmpty().withMessage('Housing type is required'),

  body('household_info.has_yard')
    .isBoolean().withMessage('has_yard must be a boolean (true/false)'),

  body('household_info.has_other_pets')
    .isBoolean().withMessage('has_other_pets must be a boolean (true/false)'),

  body('household_info.has_children')
    .isBoolean().withMessage('has_children must be a boolean (true/false)'),

  // Middleware function to intercept and return validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { adopterValidationRules }