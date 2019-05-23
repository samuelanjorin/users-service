import bodyParser from 'body-parser'
import rateLimiter from '../middlewares/rateLimit'
import customers from './customers'

export default (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(rateLimiter)
  app.use('/v1/api/', customers)
}
