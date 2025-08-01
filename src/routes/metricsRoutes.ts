import { Router } from 'express'
import { getMetrics } from '../controllers/metricsController'

export const metricsRoutes = Router()

/**
 * @swagger
 * tags:
 *   name: Metrics
 *   description: Station analytics and system insights
 */

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Get metrics for stations
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStations:
 *                   type: integer
 *                   example: 8
 *                 activeStations:
 *                   type: integer
 *                   example: 5
 *                 inactiveStations:
 *                   type: integer
 *                   example: 3
 *                 avgCapacity:
 *                   type: number
 *                   example: 20.3
 */
metricsRoutes.get('/', getMetrics)
