/* eslint-disable camelcase */
import isEmpty from 'lodash.isempty'
import customerService from '../services/customer'
import asyncF from '../middlewares/async'
import globalFunc from '../utils/globalfunc'
import constants from '../constants/index'
import errorFormat from '../utils/errors/errorFormat'

let field = 'email'
function signupCustomer () {
  return asyncF(async (req, res) => {
    const { name, email, password } = req.body
    const response = await customerService.createCustomer({
      name,
      email,
      password
    })
    if (response === constants.ERROR_CODES.USR_04) {
      let error = errorFormat(
        { code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.USR_04),
          msg: response,
          param: 'email',
          status: constants.NETWORK_CODES.HTTP_BAD_REQUEST }
      )
      return res.json(error).status(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    }
    let customerJSON = globalFunc.createCustomerJSON(response.customer, response.access_token)
    if (customerJSON !== null) {
      customerJSON = globalFunc.convertObjectValuesRecursive(customerJSON, null, '')
      return res.json(customerJSON).status(constants.NETWORK_CODES.HTTP_CREATED)
    }
  })
}

function getCustomer () {
  return asyncF(async (req, res) => {
    const customer = await customerService.getCustomer(req.query.customer_id, false)

    if (isEmpty(customer)) {
      return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
        code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.USR_02),
        message: constants.ERROR_CODES.USR_02,
        field
      })
    }
    const customerJSON = globalFunc.createCustomerJSON(customer)
    return res.json(customerJSON).status(constants.NETWORK_CODES.HTTP_CREATED)
  })
}

function updateCustomerDetails () {
  return asyncF(async (req, res) => {
    const response = await customerService.updateCustomerDetails(req)
    response.customer.dataValues.credit_card = globalFunc.maskCreditCard(response.customer.dataValues.credit_card)
    let customerJSON = globalFunc.convertObjectValuesRecursive(response.customer.dataValues, null, '')
    return res.json(customerJSON).status(constants.NETWORK_CODES.HTTP_SUCCESS)
  }
  )
}

function updateCustomerCreditCard () {
  return asyncF(async (req, res) => {
    const response = await customerService.updateCustomerCreditCard(req)
    response.customer.dataValues.credit_card = globalFunc.maskCreditCard(response.customer.dataValues.credit_card)
    let customerJSON = globalFunc.convertObjectValuesRecursive(response.customer.dataValues, null, '')
    return res.json(customerJSON).status(constants.NETWORK_CODES.HTTP_SUCCESS)
  })
}

function updateCustomerAddress () {
  return asyncF(async (req, res) => {
    let access_token = globalFunc.getToken(req.headers)
    const response = await customerService.updateCustomerAddress(req)
    let customerJSON = globalFunc.createCustomerJSON(response.customer.dataValues, access_token)
    customerJSON = globalFunc.convertObjectValuesRecursive(customerJSON, null, '')
    return res.json(customerJSON).status(constants.NETWORK_CODES.HTTP_CREATED)
  }
  )
}

function facebookLogin () {
  return asyncF(async (req, res) => {
    const { access_token } = req.body

    const response = await customerService.facebookLogin(access_token)
    if (response === constants.ERROR_CODES.USR_03) {
      let error = errorFormat(
        { code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.USR_03),
          msg: response,
          param: 'email',
          status: constants.NETWORK_CODES.HTTP_BAD_REQUEST }
      )
      return res.json(error).status(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    }
    let customerJSON = globalFunc.createCustomerJSON(response.customer.dataValues, access_token)
    customerJSON = globalFunc.convertObjectValuesRecursive(customerJSON, null, '')
    return res.json(customerJSON).status(constants.NETWORK_CODES.HTTP_CREATED)
  })
}
function loginCustomer () {
  return asyncF(async (req, res) => {
    const { email, password } = req.body
    const response = await customerService.getLoginDetails(password, email)
    if (response === constants.ERROR_CODES.USR_01) {
      let error = errorFormat(
        { code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.USR_01),
          msg: response,
          param: 'email',
          status: constants.NETWORK_CODES.HTTP_BAD_REQUEST }
      )
      return res.json(error).status(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    }
    let customerJSON = globalFunc.createCustomerJSON(response.customer.dataValues, response.token)
    customerJSON = globalFunc.convertObjectValuesRecursive(customerJSON, null, '')
    return res.json(customerJSON).status(constants.NETWORK_CODES.HTTP_CREATED)
  })
}

export default {
  getCustomer,
  updateCustomerAddress,
  updateCustomerDetails,
  updateCustomerCreditCard,
  facebookLogin,
  loginCustomer,
  signupCustomer

}
