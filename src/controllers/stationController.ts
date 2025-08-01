import { Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { Station } from '../models/Station'

// Access the repository for Station entities
const stationRepo = AppDataSource.getRepository(Station)

/**
 * Creates a new charging station with the provided data.
 */
export const createStation = async (req: Request, res: Response) => {
  const { name, location, maxCapacityKW } = req.body

  // Validate required fields
  if (!name || !location || !maxCapacityKW) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  // Create new station with default 'active' status
  const station = stationRepo.create({
    name,
    location,
    maxCapacityKW,
    status: 'active'
  })

  await stationRepo.save(station)
  res.status(201).json(station)
}

/**
 * Retrieves the full list of charging stations.
 */
export const getStations = async (_: Request, res: Response) => {
  const stations = await stationRepo.find()
  res.json(stations)
}

/**
 * Updates the status of a specific charging station.
 */
export const updateStationStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body

  // Validate status value
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' })
  }

  // Retrieve station by ID
  const stationRepo = AppDataSource.getRepository(Station)
  const station = await stationRepo.findOneBy({ id })

  if (!station) return res.status(404).json({ message: 'Station not found' })

  // Update and save new status
  station.status = status as 'active' | 'inactive'
  await stationRepo.save(station)

  res.json({
    message: 'Station status updated',
    station
  })
}
