import { Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { User } from '../models/User'
import { AuthRequest } from '../middlewares/authMiddleware'

// Access the repository for User entities
const userRepository = AppDataSource.getRepository(User)

/**
 * Retrieves the authenticated user's profile.
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id

  // Validate token payload
  if (!userId) return res.status(400).json({ message: 'Invalid token payload' })

  // Look up the user by ID
  const user = await userRepository.findOneBy({ id: userId })
  if (!user) return res.status(404).json({ message: 'User not found' })

  // Return user profile (omit sensitive fields like password)
  res.json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  })
}
