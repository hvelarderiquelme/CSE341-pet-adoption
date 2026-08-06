const express = require('express');
const request = require('supertest');
const { ObjectId } = require('mongodb');

// Mock the DB layer so these are true unit tests: no real MongoDB connection.
jest.mock('../config/db', () => ({
  getCollection: jest.fn()
}));

const { getCollection } = require('../config/db');
const adopterRoutes = require('../routes/adopterRoutes');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/adopters', adopterRoutes);
  return app;
}

describe('GET /adopters', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 200 and the full list of adopters', async () => {
    const fakeAdopters = [
      { _id: new ObjectId(),
        "first_name": "Alex",
        "last_name": "Wong",
        "email": "alex.wong@example.org",
        "phone": "780-555-0433",
        "location": {
            "city": "Edmonton",
            "state": "AB",
            "postal_code": "T6G 2R3"
            },
        "preferences": {
            "preferred_species": [
                "Dog",
                "Cat"
        ],
            "preferred_size": "Medium",
            "max_age": 8
        },
        "household_info": {
         "housing_type": "Condo",
        "has_yard": false,
        "has_other_pets": false,
        "has_children": false
        }
      }
    ];

    getCollection.mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(fakeAdopters)
      })
    });

    const res = await request(buildApp()).get('/adopters');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].first_name).toBe('Alex');
    expect(res.body[0].email).toBe('alex.wong@example.org');
    expect(res.body[0].phone).toBe('780-555-0433');
    expect(res.body[0].location.postal_code).toBe('T6G 2R3');
  });

  it('returns 500 when the database call fails', async () => {
    getCollection.mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('DB down'))
      })
    });

    const res = await request(buildApp()).get('/adopters');

    expect(res.status).toBe(500);
  });
});

describe('GET /adopters/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 200 and the matching adopter when found', async () => {
    const id = new ObjectId();
    const fakeAdopters = { 
        _id: id, 
        last_name: 'Wong', 
        location:{
            city: 'Edmonton', 
            state: 'AB', 
            postal_code: 'T6G 2R3'
        } 
    };
    
    getCollection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(fakeAdopters)
    });

    const res = await request(buildApp()).get(`/adopters/${id.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body.last_name).toBe('Wong');
    expect(res.body.location.city).toBe('Edmonton');
    expect(res.body.location.state).toBe('AB');
    expect(res.body.location.postal_code).toBe('T6G 2R3');
    
  });

  it('returns 404 when no adopter matches the id', async () => {
    const id = new ObjectId();
    getCollection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null)
    });

    const res = await request(buildApp()).get(`/adopters/${id.toString()}`);

    expect(res.status).toBe(404);
  });

  it('returns 500 when the id is not a valid ObjectId', async () => {
    const res = await request(buildApp()).get('/adopters/not-a-valid-id');

    expect(res.status).toBe(500);
  });
});
