import { Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { Station } from '../models/Station'
import { ILike, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm'

// Access the repository for Station entities
const stationRepo = AppDataSource.getRepository(Station)

/**
 * POST /stations
 * 
 * Creates a new charging station with the provided data.
 * Fields required: name, location, maxCapacityKW
 * 
 * The station is created with default status 'active'.
 */
export const createStation = async (req: Request, res: Response) => {
  const { name, location, maxCapacityKW } = req.body

  if (!name || !location || !maxCapacityKW) {
    return res.status(400).json({ message: 'Missing fields' })
  }

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
 * GET /stations
 * 
 * Retrieves a list of charging stations with optional filters:
 * - status: 'active' | 'inactive'
 * - location: partial string (case-insensitive)
 * - minCapacity / maxCapacity: filter by maxCapacityKW range
 */
export const getStations = async (req: Request, res: Response) => {
  try {
    const { status, location, minCapacity, maxCapacity } = req.query

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (location) {
      where.location = ILike(`%${location}%`)
    }

    if (minCapacity || maxCapacity) {
      if (minCapacity && maxCapacity) {
        where.maxCapacityKW = Between(Number(minCapacity), Number(maxCapacity))
      } else if (minCapacity) {
        where.maxCapacityKW = MoreThanOrEqual(Number(minCapacity))
      } else if (maxCapacity) {
        where.maxCapacityKW = LessThanOrEqual(Number(maxCapacity))
      }
    }

    const stations = await stationRepo.find({ where })
    res.status(200).json(stations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error retrieving stations' })
  }
}

/**
 * PATCH /stations/:id/status
 * 
 * Updates the status of a specific charging station.
 * Body must include: status = 'active' | 'inactive'
 */
export const updateStationStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' })
  }

  const station = await stationRepo.findOneBy({ id })

  if (!station) {
    return res.status(404).json({ message: 'Station not found' })
  }

  station.status = status as 'active' | 'inactive'
  await stationRepo.save(station)

  res.json({
    message: 'Station status updated',
    station
  })
}
