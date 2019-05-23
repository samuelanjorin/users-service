/* eslint-disable camelcase */
import isEmpty from 'lodash.isempty'
import customerService from '../services/customer'
import { removePassword } from '../utils/passwordcrypt'
import networkStatus from '../utils/networkStatus'
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

function updateCustomerBiodata () {
  return asyncF(async (req, res) => {
    const { customer } = req
    const updatedCustomer = await customer.updateCustomerFields(req.body)
    return networkStatus.httpSuccessResponse(
      req, res, removePassword(updatedCustomer.dataValues), false)
  })
}

function updateCustomerCreditCard () {
  return asyncF(async (req, res) => {
    const { customer } = req
    const updatedCustomer = await customer.updateCustomerCreditCard(req.body)
    return networkStatus.httpSuccessResponse(
      req, res, removePassword(updatedCustomer.dataValues), false)
  })
}

function updateCustomerAddress () {
  asyncF(async (req, res) => {
    const updatedCustomer = await customer.updateCustomerAddress(req.body)
    return networkStatus.httpSuccessResponse(
      req, res, removePassword(updatedCustomer.dataValues), false)
  }
  )
}

function facebookLogin () {
  return asyncF(async (req, res) => {
    const { access_token } = req.body
    const { data: { email, name } } = await customerService.facebookVerification(access_token)
    let customer = await customerService.getCustomer(email, false)
    if (isEmpty(customer)) {
      customer = await customerService.createCustomer({
        email,
        name,
        password: '@#$%^!@#$@##$$$$%%^^^!@@###$$'
      })
    }
    const customerJSON = globalFunc.createCustomerJSON(customer)
    return res.json(customerJSON).status(constants.NETWORK_CODES.HTTP_CREATED)
  }, true)
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
    let customerJSON = globalFunc.createCustomerJSON(response.customer.dataValues)
    customerJSON = globalFunc.convertObjectValuesRecursive(customerJSON, null, '')
    return res.json(customerJSON).status(constants.NETWORK_CODES.HTTP_CREATED)
  })
}

export default {
  getCustomer,
  updateCustomerAddress,
  updateCustomerBiodata,
  updateCustomerCreditCard,
  facebookLogin,
  loginCustomer,
  signupCustomer

}
