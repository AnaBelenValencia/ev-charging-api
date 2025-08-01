import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

/**
 * Extends the Express Request object to include a `user` property,
 * which will be populated after successful JWT verification.
 */
export interface AuthRequest extends Request {
  user?: any
}

/**
 * Middleware that validates the presence and validity of a JWT token
 * in the Authorization header of incoming requests.
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  // Check for presence of Bearer token
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' })

  const token = authHeader.split(' ')[1]

  try {
    // Verify token and attach payload to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' })
  }
}
