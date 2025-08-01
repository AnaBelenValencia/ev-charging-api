import dotenv from 'dotenv'
dotenv.config()

import request from 'supertest'
import { app } from '../app'
import { AppDataSource } from '../config/data-source'

describe('Station Endpoints', () => {
  let token: string
  let stationId: string

  beforeAll(async () => {
    // Ensure DB is connected
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    // Login to get auth token
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

  it('should return 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/stations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Incomplete Station' })

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Missing fields')
  })

  it('should create a new station successfully', async () => {
    const res = await request(app)
      .post('/api/stations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Station',
        location: 'CDMX',
        maxCapacityKW: 50
      })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.status).toBe('active')
    stationId = res.body.id
  })

  it('should return a list of stations', async () => {
    const res = await request(app)
      .get('/api/stations')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('should update the status of a station', async () => {
    const res = await request(app)
      .patch(`/api/stations/${stationId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'inactive' })

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Station status updated')
    expect(res.body.station.status).toBe('inactive')
  })

  it('should return 400 for invalid status value', async () => {
    const res = await request(app)
      .patch(`/api/stations/${stationId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'paused' })

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Invalid status value')
  })

  it('should return 404 for non-existent station', async () => {
    const res = await request(app)
      .patch('/api/stations/bce1fd9b-a117-482f-0000-711833714409/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'active' })


    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Station not found')
  })
})
