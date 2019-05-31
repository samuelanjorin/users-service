/* eslint-disable camelcase */
import shortId from 'shortid'
import { removePassword } from '../utils/passwordcrypt'
// import constants from '../constants';
import envconfig from '../config/envconfig'

function getKeyByValue (object, value) {
  return Object.keys(object).find(key => object[key] === value)
}

function getUniqueId () {
  return shortId.generate()
}
function getPageParams (request) {
  const { page, limit, description_length } = request
  const numberOfPage = parseInt(page, 10) || 1
  const pageLimit = parseInt(limit, 10) || 20
  const descriptionLength = parseInt(description_length, 10) || 200

  return { numberOfPage, pageLimit, descriptionLength }
}

const isValueValid = (id) => {
  let valid = false
  const parsedId = parseInt(id, 10)
  !isNaN(parsedId) && (valid = true)
  return { valid, parsedId }
}
const createCustomerJSON = (customer, accessToken) => {
  if (customer.credit_card) {
    let credit_card = customer.credit_card
    customer.creditCard = maskCreditCard(credit_card)
  }

  let customerDetails = {
    customer: { schema: removePassword(customer) }
  }
  let tokenObject = {
    accessToken,
    expires_in: envconfig.tokenExpiration
  }
  return Object.assign(customerDetails, tokenObject)
}
function convertObjectValuesRecursive (obj, target, replacement) {
  obj = { ...obj }
  Object.keys(obj).forEach((key) => {
    if (obj[key] === target) {
      obj[key] = replacement
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      obj[key] = convertObjectValuesRecursive(obj[key], target, replacement)
    }
  })
  return obj
}

function getToken (req) {
  const { user_key } = req
  const userKey = user_key.split(' ')
  return userKey[1]
}
function maskCreditCard (creditCard) {
  if (creditCard) {
    return ((creditCard.length === 12) ? 'XXXXXXXX' + creditCard.substr(8, creditCard.length - 1) : creditCard)
  }
  return ''
}
export default { getKeyByValue, getUniqueId, getPageParams, isValueValid, createCustomerJSON, convertObjectValuesRecursive, getToken, maskCreditCard }
