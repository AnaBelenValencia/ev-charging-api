import dotenv from 'dotenv'
dotenv.config()

import request from 'supertest'
import { app } from '../app'
import { AppDataSource } from '../config/data-source'
import { User } from '../models/User'
import bcrypt from 'bcryptjs'
import { UserRole } from '../utils/types'

/**
 * Integration tests for the /api/users/profile endpoint.
 * 
 * These tests verify token authentication and profile data retrieval.
 */
describe('User Profile Endpoint', () => {
  let token: string
  const TEST_EMAIL = 'avalencia_user@example.com'

  /**
   * Set up test environment:
   * - Initialize database
   * - Create test user
   * - Authenticate and store JWT
   */
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    const userRepository = AppDataSource.getRepository(User)
    await userRepository.delete({ email: TEST_EMAIL })

    const hashedPassword = await bcrypt.hash('supersecret123', 10)

    await userRepository.save({
      email: TEST_EMAIL,
      password: hashedPassword,
      role: UserRole.ADMIN
    })

    const res = await request(app).post('/api/auth/login').send({
      email: TEST_EMAIL,
      password: 'supersecret123'
    })

    expect(res.statusCode).toBe(200)
    token = res.body.token
  })

  /**
   * Clean up after tests:
   * - Delete test user
   * - Destroy database connection
   */
  afterAll(async () => {
    const userRepository = AppDataSource.getRepository(User)
    await userRepository.delete({ email: TEST_EMAIL })

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })

  /**
   * Should return 401 if no token is provided
   */
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/users/profile')
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })

  /**
   * Should return 403 if token is invalid
   */
  it('should return 403 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalid.token.here')

    expect(res.statusCode).toBe(403)
    expect(res.body.message).toBe('Invalid token')
  })

  /**
   * Should return user profile for valid token
   */
  it('should return profile data for valid token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('email')
    expect(res.body).toHaveProperty('role')
  })
})
