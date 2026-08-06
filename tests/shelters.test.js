const express = require('express');
const request = require('supertest');
const { ObjectId } = require('mongodb');

// Mock the DB layer so these are true unit tests: no real MongoDB connection.
jest.mock('../config/db', () => ({
  getCollection: jest.fn()
}));

const { getCollection } = require('../config/db');
const shelterRoutes = require('../routes/shelters');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/shelters', shelterRoutes);
  return app;
}

describe('GET /shelters', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 200 and the full list of shelters', async () => {
    const fakeShelters = [
      { _id: new ObjectId(), name: 'Happy Tails' },
      { _id: new ObjectId(), name: 'Second Chance' }
    ];
    getCollection.mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(fakeShelters)
      })
    });

    const res = await request(buildApp()).get('/shelters');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('Happy Tails');
  });

  it('returns 500 when the database call fails', async () => {
    getCollection.mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('DB down'))
      })
    });

    const res = await request(buildApp()).get('/shelters');

    expect(res.status).toBe(500);
  });
});

describe('GET /shelters/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 200 and the matching shelter when found', async () => {
    const id = new ObjectId();
    const fakeShelter = { _id: id, name: 'Happy Tails' };
    getCollection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(fakeShelter)
    });

    const res = await request(buildApp()).get(`/shelters/${id.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Happy Tails');
  });

  it('returns 404 when no shelter matches the id', async () => {
    const id = new ObjectId();
    getCollection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null)
    });

    const res = await request(buildApp()).get(`/shelters/${id.toString()}`);

    expect(res.status).toBe(404);
  });

  it('returns 400 when the id is not a valid ObjectId', async () => {
    const res = await request(buildApp()).get('/shelters/not-a-valid-id');

    expect(res.status).toBe(400);
  });
});
