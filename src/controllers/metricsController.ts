import { Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { Station } from '../models/Station'

/**
 * Retrieves key metrics about charging stations.
 */
export const getMetrics = async (_req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Station)

  // Count total number of stations
  const total = await repo.count()

  // Count stations with 'active' status
  const active = await repo.count({ where: { status: 'active' } })

  // Calculate number of inactive stations
  const inactive = total - active

  // Calculate average maxCapacityKW across all stations
  const { avg } = await repo
    .createQueryBuilder('station')
    .select('AVG(station.maxCapacityKW)', 'avg')
    .getRawOne()

  // Return metrics as a JSON response
  return res.json({
    totalStations: total,
    activeStations: active,
    inactiveStations: inactive,
    avgCapacity: parseFloat(avg) || 0
  })
}
