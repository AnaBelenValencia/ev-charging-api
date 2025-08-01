import cron from 'node-cron'
import { AppDataSource } from '../config/data-source'
import { Station } from '../models/Station'

/**
 * Starts a scheduled job that runs every minute to check and update
 * the status of each charging station based on its `autoSwitchMinutes` config.
 */
export const startStationStatusJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log('[CRON] Executing station reviwe...')

    const repo = AppDataSource.getRepository(Station)
    const stations = await repo.find()

    const now = new Date()

    for (const station of stations) {
      const updatedAt = new Date(station.updatedAt)
      const diffMs = now.getTime() - updatedAt.getTime()
      const diffMinutes = diffMs / (1000 * 60)

      // If enough time has passed, toggle station status
      if (diffMinutes >= station.autoSwitchMinutes) {
        station.status = station.status === 'active' ? 'inactive' : 'active'
        await repo.save(station)
        console.log(`Station status "${station.name}" updated to ${station.status}`)
      }
    }
  })
}
