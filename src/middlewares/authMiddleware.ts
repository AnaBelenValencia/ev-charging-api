import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserRole } from '../utils/types'

/**
 * Authentication middleware
 * 
 * Validates the presence and structure of a JWT token in the `Authorization` header.
 * If the token is valid, attaches the decoded user payload to `req.user`.
 * 
 * Expected token format: "Bearer <token>"
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  // Check for a Bearer token
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number
      email: string
      role: UserRole
    }

    // Attach decoded user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }

    next()
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' })
  }
}
