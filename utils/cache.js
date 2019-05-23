import client from '../config/redis'
import constants from '../constants'
import networkStatus from '../utils/networkStatus'

function lookCache (req, res, next) {
  const originalUrl = req.originalUrl
  const urlArray = originalUrl.split('/')
  return client.get(`turing_request: ${req.originalUrl}`, (err, result) => {
    if (result) {
      const resultJSON = JSON.parse(result)
      if (urlArray.includes('id')) {
        return networkStatus.httpSuccessEachResponse(req, res, resultJSON, false)
      }
      if (resultJSON.data) {
        return networkStatus.httpSuccessCollectionResponse(req, res, resultJSON.data, false)
      }
      if (resultJSON.error) {
        res.statusCode = constants.NETWORK_CODES.HTTP_BAD_REQUEST
      }
      return networkStatus.httpSuccessEachResponse(req, res, resultJSON, false)
    }
    if (err) {
      /// logger
    }
    return next()
  })
}

function addToCache (key, data, type) {
  if (type === constants.CACHE_TYPES.hour) {
    client.setex(`turing_request: ${key}`, constants.CACHE_HOUR.one, JSON.stringify(data))
  }
  if (type === constants.CACHE_TYPES.day) {
    client.setex(`turing_request: ${key}`, constants.CACHE_HOUR.twenty_four, JSON.stringify(data))
  }
}
export default { lookCache, addToCache }
