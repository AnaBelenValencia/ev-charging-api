import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import { app } from './app'
import { AppDataSource } from './config/data-source'
import { startStationStatusJob } from './cron/stationStatusJob'

const PORT = process.env.PORT || 3000

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected')

    app.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}`)
      startStationStatusJob()
    })
  })
  .catch((error) => {
    console.error('Error connecting to the database', error)
  })
