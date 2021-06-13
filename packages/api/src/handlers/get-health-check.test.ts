import request from 'supertest';

import { createApp } from "../app";

describe('Health Check Tests', () => {
  const app = createApp();
  const path = '/health-check';

  it('should return 200 status', async () => {
    const response = await request(app).get(path)

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      message: 'Working as expected'
    })
  });
});