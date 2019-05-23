import dotenv from 'dotenv'

dotenv.config()
const {
  CLIENT_SECRET,
  DIALECT,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  TEST_DIALECT,
  TEST_DATABASE_HOST,
  TEST_DATABASE_NAME,
  TEST_DATABASE_PASSWORD,
  TOKEN_EXPIRATION,
  FACEBOOK_URL,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT
} = process.env

export default {
  database: {
    name: DATABASE_NAME,
    username: DATABASE_USERNAME,
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    dialect: DIALECT
  },

  unitTestDatabase: {
    dbName: TEST_DATABASE_NAME,
    host: TEST_DATABASE_HOST,
    password: TEST_DATABASE_PASSWORD,
    dialect: TEST_DIALECT
  },
  appSecret: CLIENT_SECRET,
  tokenExpiration: TOKEN_EXPIRATION,
  facebookUrl: FACEBOOK_URL,
  redis: {
    host: REDIS_HOST || '127.0.0.1',
    password: REDIS_PASSWORD || '',
    port: REDIS_PORT || 6379

  }

}
