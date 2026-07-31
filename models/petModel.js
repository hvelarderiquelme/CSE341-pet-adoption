const { Joi } = require('celebrate');
const { ObjectId } = require('mongodb');

const petsBodySchema = Joi.object({
    name: Joi.string().trim().required(),
    species: Joi.string().trim().required(),
    breed: Joi.string().trim().required(),
    age: Joi.number().integer().min(0).optional(),
    gender: Joi.string().lowercase().valid('male', 'female').required().trim(),
    size: Joi.string().lowercase().valid('small', 'medium', 'large').required(),
    status: Joi.string().lowercase().valid('available', 'adopted', 'pending').required(),
    shelter_id: Joi.string().default(() => new ObjectId().toString()),
    description: Joi.string().trim().optional(),
    traits: Joi.array().items(Joi.string().trim()).optional(),
    intake_date: Joi.date().default(() => new Date())
}).unknown(true);

module.exports = petsBodySchema;