import cron from 'node-cron'
import { AppDataSource } from '../config/data-source'
import { Station } from '../models/Station'

/**
 * Starts a scheduled cron job that runs every minute.
 * 
 * For each station, it checks whether the configured `autoSwitchMinutes` threshold
 * has passed since the last update (`updatedAt`). If so, it toggles the station's
 * status between 'active' and 'inactive'.
 */
export const startStationStatusJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log('[CRON] Executing station review...')

    const repo = AppDataSource.getRepository(Station)
    const stations = await repo.find()
    const now = new Date()

    for (const station of stations) {
      const updatedAt = new Date(station.updatedAt)
      const diffMs = now.getTime() - updatedAt.getTime()
      const diffMinutes = diffMs / (1000 * 60)

      // If enough time has passed, toggle the station status
      if (diffMinutes >= station.autoSwitchMinutes) {
        station.status = station.status === 'active' ? 'inactive' : 'active'
        await repo.save(station)

        console.log(
          `Station "${station.name}" status updated to "${station.status}"`
        )
      }
    }
  })
}
