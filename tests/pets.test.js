const express = require('express');
const request = require('supertest');
const { ObjectId } = require('mongodb');

// Mock the DB layer so these are true unit tests: no real MongoDB connection.
jest.mock('../config/db', () => ({
  getCollection: jest.fn()
}));

const { getCollection } = require('../config/db');
const petRoutes = require('../routes/petRoutes');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/pets', petRoutes);
  return app;
}

describe('GET /pets', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 200 and the full list of pets', async () => {
    const fakePets = [
      { _id: new ObjectId(), name: 'Fido', species: 'dog' },
      { _id: new ObjectId(), name: 'Whiskers', species: 'cat' }
    ];
    getCollection.mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(fakePets)
      })
    });

    const res = await request(buildApp()).get('/pets');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('Fido');
  });

  it('returns 500 when the database call fails', async () => {
    getCollection.mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('DB down'))
      })
    });

    const res = await request(buildApp()).get('/pets');

    expect(res.status).toBe(500);
  });
});

describe('GET /pets/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 200 and the matching pet when found', async () => {
    const id = new ObjectId();
    const fakePet = { _id: id, name: 'Fido', species: 'dog' };
    getCollection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(fakePet)
    });

    const res = await request(buildApp()).get(`/pets/${id.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Fido');
  });

  it('returns 404 when no pet matches the id', async () => {
    const id = new ObjectId();
    getCollection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null)
    });

    const res = await request(buildApp()).get(`/pets/${id.toString()}`);

    expect(res.status).toBe(404);
  });

  it('returns 500 when the id is not a valid ObjectId', async () => {
    getCollection.mockReturnValue({
      findOne: jest.fn()
    });

    const res = await request(buildApp()).get('/pets/not-a-valid-id');

    expect(res.status).toBe(500);
  });
});
