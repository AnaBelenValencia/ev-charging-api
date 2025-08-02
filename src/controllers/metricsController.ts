import { Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { Station } from '../models/Station'
import { Between, ILike } from 'typeorm'

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const { status, location, from, to } = req.query

    const where: any = {}

    // Filter by station status
    if (status) {
      where.status = status
    }

    // Filter by location using case-insensitive LIKE
    if (location) {
      where.location = ILike(`%${location}%`)
    }

    // Filter by creation date range
    if (from || to) {
      const fromDate = from ? new Date(from as string) : new Date('1970-01-01')
      const toDate = to ? new Date(to as string) : new Date()
      where.createdAt = Between(fromDate, toDate)
    }

    const stationRepo = AppDataSource.getRepository(Station)
    const stations = await stationRepo.find({ where })

    const totalStations = stations.length
    const activeStations = stations.filter((s) => s.status === 'active').length
    const inactiveStations = stations.filter((s) => s.status === 'inactive').length
    const avgCapacity =
      stations.reduce((sum, s) => sum + s.maxCapacityKW, 0) / (stations.length || 1)

    res.status(200).json({
      totalStations,
      activeStations,
      inactiveStations,
      avgCapacity: Number(avgCapacity.toFixed(2))
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error retrieving metrics' })
  }
}
