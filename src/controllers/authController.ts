import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/data-source'
import { User } from '../models/User'

// Access the User repository from TypeORM's data source
const userRepository = AppDataSource.getRepository(User)

/**
 * Registers a new user with an email and password.
 * Validates that both fields are present and that the email is unique.
 * Passwords are securely hashed before being stored.
 */
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  // Check for existing user
  const existingUser = await userRepository.findOne({ where: { email } })
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' })
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create and save new user
  const newUser = userRepository.create({
    email,
    password: hashedPassword
  })

  await userRepository.save(newUser)

  res.status(201).json({ message: 'User registered successfully' })
}

/**
 * Authenticates a user using email and password.
 * If valid, returns a signed JWT token valid for 1 hour.
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  // Find user by email
  const user = await userRepository.findOne({ where: { email } })
  if (!user) return res.status(404).json({ message: 'User not found' })

  // Compare password with hash
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  })

  res.json({ token })
}
