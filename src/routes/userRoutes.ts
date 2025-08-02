import { Router } from 'express'
import { register, login } from '../controllers/authController'
import { getProfile, getUsers } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { checkRole } from '../middlewares/checkRole'
import { UserRole } from '../utils/types'

export const userRoutes = Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, station_manager]
 *
 *     RegisterInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           example: Ana Belen
 *         email:
 *           type: string
 *           example: ana@example.com
 *         role:
 *           type: string
 *           enum: [admin, station_manager]
 *         password:
 *           type: string
 *           example: supersecret123
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: ana@example.com
 *         password:
 *           type: string
 *           example: supersecret123
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already in use
 */
userRoutes.post('/register', authMiddleware, checkRole(UserRole.ADMIN), register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *       401:
 *         description: Invalid credentials
 */
userRoutes.post('/login', login);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
userRoutes.get('/profile', authMiddleware, getProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [admin, station_manager]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 */

userRoutes.get('/', authMiddleware, checkRole(UserRole.ADMIN), getUsers)