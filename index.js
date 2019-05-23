import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import morgan from 'morgan'
import logger from './utils/errors/errorlogger'
import routeDependencies from './routes/routedependencies'

const app = express()
app.use(helmet())
app.set('trust proxy', 1)
app.use(morgan('combined', { 'stream': logger.stream }))
routeDependencies(app)
dotenv.config()

const port = process.env.RACS_PORT || 7001

app.listen(port, () => {
  console.log(`Listening to port ${port}.......`)
})
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

process.on('uncaughtException', (ex) => {
  logger.error(ex.message, ex)
})
process.on('unhandledRejection', (ex) => {
  logger.error(ex.message, ex)
})