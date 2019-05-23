/* eslint-disable camelcase */
import db from '../models/index'
import facebookVerification from '../utils/verifyFacebookToken'
import { removePassword, comparePassword, hashPassword } from '../utils/passwordcrypt'
import authenticate from '../middlewares/authenticate'
import constants from '../constants/index'

const customerDb = db.customer

async function getCustomerById (customer_id) {
  const customer = await customerDb.findOne({
    where: { customer_id }
  })

  return customer
}

async function getCustomerByEmail (email, passwordCheck) {
  const customer = await customerDb.findOne({
    where: { email }
  })
  if (customer !== null) {
    if (passwordCheck === false) {
      return removePassword(customer)
    }
  }
  return customer
}

async function createCustomer (payLoad) {
  payLoad.password = hashPassword(payLoad.password)
  let customer = await getCustomerByEmail(payLoad.email)

  if (customer === null) {
    await customerDb.create(payLoad)
    customer = await getCustomerByEmail(payLoad.email)
    const access_token = authenticate.generateToken(customer.dataValues.customer_id)
    return { customer: removePassword(customer.dataValues), access_token }
  } else {
    return constants.ERROR_CODES.USR_04
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
  let customer = await getCustomerByEmail(email)
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
  const customer = getCustomerByEmail(email)
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

async function updateCustomerCreditCard (user) {
  const customer = getCustomerById(user.customer_id)
  customer.credit_card = user.credit_card
  await customer.save()
  await customer.reload()
  return customer
};

async function updateCustomerAddress (user) {
  const customer = getCustomerById(user.customer_id)
  const { address_1, address_2, city, region, postal_code, country, shipping_region_id } = user
  customer.address_1 = address_1
  customer.region = region
  customer.postal_code = postal_code
  customer.address_2 = address_2
  customer.city = city
  customer.country = country
  customer.shipping_region_id = shipping_region_id
  await customer.save()
  await customer.reload()
  return customer
}

export default {
  getCustomerById,
  createCustomer,
  facebookVerification,
  updateCustomerDetails,
  updateCustomerAddress,
  updateCustomerCreditCard,
  getLoginDetails
}
