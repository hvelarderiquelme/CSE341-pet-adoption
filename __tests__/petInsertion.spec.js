
jest.setTimeout(10000); // 10 seconds
const request = require('supertest');
const express = require('express');
const petRoutes = require('../routes/petRoutes');
const petsBodySchema = require('../models/petModel');
const { celebrate, Joi, Segments } = require('celebrate');

const app = express();
app.use(express.json());
app.use('/pets', petRoutes);

describe('POST /pets - petInsertion', () => {
    it('should create a pet with valid payload', async () => {
        const validPet = {
            name: 'Buddy',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: 3,
            gender: 'male',
            size: 'medium',
            status: 'available',
            description: 'Friendly dog',
            traits: ['playful', 'loyal']
        };

        const response = await request(app)
            .post('/pets') // this refers to the route defined in petRoutes.js
            .send(validPet); // sending the validPet object as the request body

        expect(response.status).toBe(201); // we expet 201 Created status code
        expect(response.body).toHaveProperty('message', 'New pet record created'); // we expect the response body to have a message property with the value 'New pet record created'
        expect(response.body).toHaveProperty('id'); // we expect the response body to have an id property, which is the id of the newly created pet
    });
});