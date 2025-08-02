import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'

import { authMiddleware } from './middlewares/authMiddleware'
import authRoutes from './routes/authRoutes'
import { userRoutes } from './routes/userRoutes'
import { stationRoutes } from './routes/stationRoutes'
import { metricsRoutes } from './routes/metricsRoutes'

const app = express()

// Enable CORS for all routes
app.use(cors())

// Parse incoming JSON requests
app.use(express.json())

// Health check endpoint
app.get('/', (_, res) => res.send('EV Charging API is running'))

// Public routes
app.use('/api/auth', authRoutes)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/users', userRoutes)

// Protected routes (require JWT auth)
app.use('/api', authMiddleware)
app.use('/api/stations', stationRoutes)
app.use('/api/metrics', metricsRoutes)

export { app }
