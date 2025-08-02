import { Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { User } from '../models/User'

// Access the repository for User entities
const userRepository = AppDataSource.getRepository(User)

/**
 * GET /users/profile
 * 
 * Retrieves the authenticated user's profile.
 * Requires a valid JWT with user ID in the request payload.
 */
export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId) {
    return res.status(400).json({ message: 'Invalid token payload' })
  }

  const user = await userRepository.findOneBy({ id: userId })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  // Respond with basic user info (excluding password)
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  })
}

/**
 * GET /users
 * 
 * Returns a list of all users.
 * Only public fields are returned: id, email, role, createdAt.
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find({
      select: ['id', 'email', 'role', 'createdAt']
    })

    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
}
