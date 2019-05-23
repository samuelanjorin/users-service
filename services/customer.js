/* eslint-disable camelcase */
import db from '../models/index'
import facebookVerification from '../utils/verifyFacebookToken'
import { removePassword, comparePassword, hashPassword } from '../utils/passwordcrypt'
import authenticate from '../middlewares/authenticate'
import constants from '../constants/index'

const customerDb = db.customer

async function getCustomerById (customer_id) {
  let customer = await customerDb.findOne({
    where: { customer_id }
  })
  return customer
}

async function getCustomerByEmail (email, deletePassword) {
  let customer = await customerDb.findOne({
    where: { email }
  })

  if (customer !== null) {
    if (deletePassword === true) {
      return removePassword(customer.dataValues)
    }
  }
  return customer
}

async function createCustomer (payLoad) {
  payLoad.password = hashPassword(payLoad.password)
  let customer = await getCustomerByEmail(payLoad.email, true)

  if (customer === null) {
    await customerDb.create(payLoad)
    customer = await getCustomerByEmail(payLoad.email, true)
    const access_token = authenticate.generateToken(customer.dataValues.customer_id)
    return { customer: removePassword(customer.dataValues), access_token }
  } else {
    return constants.ERROR_CODES.USR_04
  }
}
async function facebookLogin (access_token) {
  try {
    let payLoad = await facebookVerification(access_token)
    payLoad = payLoad.data
    if (payLoad.email === (null || '')) {
      return constants.ERROR_CODES.USR_03
    }
    payLoad.password = '@#$%^!@#$@##$$$$%%^^^!@@###$$'
    let customer = await getCustomerByEmail(payLoad.email, true)
    if (customer === null) {
      await customerDb.create(payLoad)
      customer = await getCustomerByEmail(payLoad.email, true)
    }
    return { customer: customer, access_token }
  } catch (err) {
    return constants.ERROR_CODES.USR_03
  }
}

async function getLoginDetails (password, email) {
  let customer = await confirmPassword(password, email)
  if (customer !== constants.ERROR_CODES.USR_01) {
    const token = authenticate.generateToken(customer.customer_id)
    return { customer, token }
  }
  return constants.ERROR_CODES.USR_01
}

async function confirmPassword (password, email) {
  let customer = await getCustomerByEmail(email, false)
  if (customer !== null) {
    let status = comparePassword(password, customer.password)
    if (status) {
      return customer
    }
    return constants.ERROR_CODES.USR_01
  }

  return constants.ERROR_CODES.USR_01
}

async function updateCustomerDetails (user) {
  const { name, email, password, day_phone, eve_phone, mob_phone } = user
  const customerValue = await getCustomerByEmail(email)
  let customer = customerValue.dataValues

  if (customer !== null) {
    customer.name = name
    customer.email = email
    customer.password = hashPassword(password)
    customer.day_phone = day_phone
    customer.eve_phone = eve_phone
    customer.mob_phone = mob_phone
    await customer.save()
    await customer.reload()
    return customer
  }
  return constants.ERROR_CODES.USR_03
}

async function updateCustomerCreditCard (user) {
  const customer = getCustomerById(user.customer_id)
  customer.credit_card = user.credit_card
  await customer.save()
  await customer.reload()
  return customer
};

async function updateCustomerAddress (req) {
  await customerDb.update(
    req.body,
    { returning: true, where: { customer_id: req.user.customer_id } }
  )

  let customer = await getCustomerById(req.user.customer_id)
  return { customer }
}

export default {
  getCustomerById,
  createCustomer,
  facebookLogin,
  updateCustomerDetails,
  updateCustomerAddress,
  updateCustomerCreditCard,
  getLoginDetails
}
