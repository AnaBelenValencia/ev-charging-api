import { Router } from 'express'
import { getStations, createStation, updateStationStatus } from '../controllers/stationController'

export const stationRoutes = Router()

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: Charging station management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Station:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - maxCapacityKW
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           example: "Estación CDMX Centro"
 *         location:
 *           type: string
 *           example: "Av. Reforma 123"
 *         maxCapacityKW:
 *           type: number
 *           example: 22.5
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           example: "active"
 *         autoSwitchMinutes:
 *           type: integer
 *           example: 15
 *           description: Minutes to auto-switch status after last update
 */

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Get all charging stations
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Station'
 */
stationRoutes.get('/', getStations)

/**
 * @swagger
 * /stations:
 *   post:
 *     summary: Register a new station
 *     tags: [Stations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Station'
 *     responses:
 *       201:
 *         description: Station created successfully
 */
stationRoutes.post('/', createStation)

/**
 * @swagger
 * /stations/{id}/status:
 *   patch:
 *     summary: Update station status
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Station status updated
 */
stationRoutes.patch('/:id/status', updateStationStatus)
