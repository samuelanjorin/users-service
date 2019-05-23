import axios from 'axios'
import logger from './errors/errorlogger'
/**
 * @description handles post requests
 *
 * @param {string} url link to direct to
 * @param {Object} headers
 * @param {string} formData
 * @returns {Object}  JSON
 */
export const postRequest = function (url, headers, formData) {
  let headersConfig = {
    headers
  }
  try {
    return axios.post(
      url,
      formData,
      headersConfig
    )
  } catch (err) {
    logger.error(err)
  }
}

/**
 * @description handles bearer token authentication
 *
 * @param {string} url link to direct to
 * @param {Object} header
 * @returns {Object}  JSON
 */
export const getRequest = async function (url, headers) {
  try {
    let headersConfig = {
      headers
    }
    let response = await axios.get(url, headersConfig)
    return response
  } catch (err) {
    logger.error(err)
  }
}