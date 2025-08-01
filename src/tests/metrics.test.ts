import dotenv from 'dotenv'
dotenv.config()

import request from 'supertest'
import { app } from '../app'
import { AppDataSource } from '../config/data-source'

describe('Metrics Endpoint', () => {
  let token: string

  beforeAll(async () => {
    // Ensure DB is connected
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    // Login to get token
    const res = await request(app).post('/api/auth/login').send({
      email: 'avalencia@example.com',
      password: 'supersecret123'
    })

    expect(res.statusCode).toBe(200)
    token = res.body.token
  })

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/metrics')
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })

  it('should return metrics with valid token', async () => {
    const res = await request(app)
      .get('/api/metrics')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('totalStations')
    expect(res.body).toHaveProperty('activeStations')
    expect(res.body).toHaveProperty('inactiveStations')
    expect(res.body).toHaveProperty('avgCapacity')
    expect(typeof res.body.avgCapacity).toBe('number')
  })
})
