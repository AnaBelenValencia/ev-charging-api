import dotenv from 'dotenv'
dotenv.config()

import request from 'supertest'
import { app } from '../app'
import { AppDataSource } from '../config/data-source'

describe('User Profile Endpoint', () => {
  let token: string

  beforeAll(async () => {
    // Initialize DB connection if not already connected
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    // Log in to get a valid token
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
    const res = await request(app).get('/api/users/profile')
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })

  it('should return 403 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalid.token.here')

    expect(res.statusCode).toBe(403)
    expect(res.body.message).toBe('Invalid token')
  })

  it('should return profile data for valid token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('email')
    expect(res.body).toHaveProperty('createdAt')
  })
})
