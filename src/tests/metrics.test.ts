import dotenv from 'dotenv'
dotenv.config()

import request from 'supertest'
import { app } from '../app'
import { AppDataSource } from '../config/data-source'
import { User } from '../models/User'
import bcrypt from 'bcryptjs'
import { UserRole } from '../utils/types'

/**
 * Integration tests for the /api/metrics endpoint.
 * 
 * These tests verify access control and data correctness of the metrics route.
 * The tests create a temporary admin user and use a valid token for authorization.
 */
describe('Metrics Endpoint', () => {
  let token: string
  const TEST_EMAIL = 'avalencia_metrics@example.com'

  /**
   * Set up test environment:
   * - Initialize DB connection
   * - Create a test admin user
   * - Authenticate and store token
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
   * Clean up test environment:
   * - Delete test user
   * - Close DB connection
   */
  afterAll(async () => {
    const userRepository = AppDataSource.getRepository(User)
    await userRepository.delete({ email: TEST_EMAIL })

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })

  /**
   * Test: Should return 401 if no token is provided
   */
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/metrics')
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })

  /**
   * Test: Should return metrics with a valid token
   */
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
