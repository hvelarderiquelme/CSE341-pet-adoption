const { Joi } = require('celebrate');
const { ObjectId } = require('mongodb');

const adoptersBodySchema = Joi.object({
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    location: Joi.object({
            city: Joi.string().trim().required(),
            state: Joi.string().trim().required(),
            postal_code: Joi.string().pattern(/^[0-9]{5}$/).required(),}).trim().required(),
    preferences: Joi.object({
        preffered_species: Joi.array().items(Joi.string().lowercase().valid('dog', 'cat', 'bird', 'other')).required(),
        preffered_size: Joi.object({
            min: Joi.number().integer().min(0).optional(),
            max: Joi.number().integer().min(0).optional()
        }).optional(),
        max_age: Joi.number().integer().min(0).optional() }),

    household_info: Joi.object({
        housing_type: Joi.string().lowercase().valid('house', 'apartment', 'condo', 'other').required(),
        has_fenced_yard: Joi.boolean().required(),
        has_other_pets: Joi.boolean().required(),
        has_children: Joi.boolean().required()
    }).optional()
}).unknown(true);

module.exports = adoptersBodySchema;