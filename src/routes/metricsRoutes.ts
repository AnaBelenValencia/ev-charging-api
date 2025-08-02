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
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter stations by status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter stations by location
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (inclusive)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (inclusive)
 *     responses:
 *       200:
 *         description: Aggregated metrics
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
