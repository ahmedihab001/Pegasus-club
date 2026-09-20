const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');

describe('Booking API Integration', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('GET /api/bookings should return 200 and an array', async () => {
    const res = await request(app)
      .get('/api/bookings?userId=test123')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});