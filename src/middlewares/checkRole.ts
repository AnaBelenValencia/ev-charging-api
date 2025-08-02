import { Request, Response, NextFunction } from 'express'
import { UserRole } from '../utils/types'

/**
 * Role-based authorization middleware
 * 
 * Accepts one or more allowed roles and checks if the authenticated user's role
 * matches any of them. If not, responds with HTTP 403 (forbidden).
 * 
 * Usage:
 *   app.get('/admin', authMiddleware, checkRole('admin'), handler)
 */
export const checkRole =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: 'Access forbidden: insufficient permissions'
      })
    }

    next()
  }
