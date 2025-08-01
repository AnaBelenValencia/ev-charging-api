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

app.use(cors())
app.use(express.json())
app.get('/', (_, res) => res.send('EV Charging API is running'))

// Public
app.use('/api/auth', authRoutes)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/users', userRoutes)

// Protected
app.use('/api', authMiddleware)
app.use('/api/stations', stationRoutes)
app.use('/api/metrics', metricsRoutes)

export { app }
