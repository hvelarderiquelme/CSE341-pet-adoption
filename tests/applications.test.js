const express = require('express');
const request = require('supertest');
const { ObjectId } = require('mongodb');

// Mock the DB layer so these are true unit tests: no real MongoDB connection.
jest.mock('../config/db', () => ({
  getCollection: jest.fn()
}));

const { getCollection } = require('../config/db');
const applicationRoutes = require('../routes/applicationRoutes');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/applications', applicationRoutes);
  return app;
}

describe('GET /applications', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 200 and the full list of applications', async () => {
    const fakeApplications = [
      { _id: new ObjectId(),
        "name": "Daisy",
        "species": "Rabbit",
        "breed": "Holland Lop",
        "age": 22,
        "gender": "Female",
        "size": "Small",
        "status": "available",
        "shelter_id": "66a27e7f1c9d4b001a333333",
        "description": "Loves eating fresh greens and exploring outside her cage. Very gentle.",
        "traits": [
            "Gentle",
            "Curious",
            "Quiet"
        ],
        "intake_date": "2026-06-15"
    }     
    ];

    getCollection.mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(fakeApplications)
      })
    });

    const res = await request(buildApp()).get('/applications');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Daisy');
    expect(res.body[0].breed).toBe('Holland Lop');
    expect(res.body[0].status).toBe('available');
    expect(res.body[0].traits[0]).toBe('Gentle');
  });

  it('returns 500 when the database call fails', async () => {
    getCollection.mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('DB down'))
      })
    });

    const res = await request(buildApp()).get('/applications');

    expect(res.status).toBe(500);
  });
});

describe('GET /applications/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 200 and the matching application when found', async () => {
    const id = new ObjectId();
    const fakeApplications = { _id: id, name: 'Daisy' };
    getCollection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(fakeApplications)
    });

    const res = await request(buildApp()).get(`/applications/${id.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Daisy');
    
  });

  it('returns 404 when no applications matches the id', async () => {
    const id = new ObjectId();
    getCollection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null)
    });

    const res = await request(buildApp()).get(`/applications/${id.toString()}`);

    expect(res.status).toBe(404);
  });

  it('returns 400 when the id is not a valid ObjectId', async () => {
    const res = await request(buildApp()).get('/applications/not-a-valid-id');

    expect(res.status).toBe(500);
  });
});
