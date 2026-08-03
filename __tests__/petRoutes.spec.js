const request = require('supertest');
const express = require('express');

const app  = express();
// Assuming you have defined your pet routes in a separate file, you would import them here
const petRoutes = require('../routes/petRoutes');
app.use('/pets', petRoutes);

describe('Pet Routes', () => {
  it('should return a list of pets', async () => {
    const response = await request(app).get('/pets');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
