import constants from '../constants/index'
/**
 * @description handles try catch errors for all routes
 *
 * @param {function} handler
 *
 */

export default function asyncF (handler, hasError = false) {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      if (hasError) {
        return res.status(constants.NETWORK_CODES.HTPP_INTERNAL_SERVER).json({
          error: error.error
        })
      }
    }
    return this.serverError(res)
  }
}
