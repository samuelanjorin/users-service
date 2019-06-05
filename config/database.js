import config from './envconfig'
import Sequelize from 'sequelize'
import logger from '../utils/errors/errorlogger'

const dbConfig = config[ process.env.NODE_ENV ]

// Option 1: Passing parameters separately
const sequelize = new Sequelize(
  dbConfig.name,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false
  })
sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.')
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err)
  })
export default sequelize
