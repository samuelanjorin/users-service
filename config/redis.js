import redis from 'redis'
import envconfig from './envconfig'
import logger from '../utils/errors/errorlogger'

let redisConfig = envconfig.redis
redis.createClient(redisConfig.port, redisConfig.host, {
  password: redisConfig.password
})

redis.on('connect', function () {
  logger.info('Redis client connected')
})
redis.on('error', function (err) {
  logger.error('Something went wrong ' + err)
})
export default redis
