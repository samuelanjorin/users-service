const ERROR_CODES = Object.freeze({
  USR_01: 'Email or Password is invalid.',
  USR_02: 'The field(s) are/is required.',
  USR_03: 'The email is invalid.',
  USR_04: 'The email already exists.',
  USR_05: "The email doesn't exist.",
  USR_06: 'This is an invalid phone number.',
  USR_07: 'This is too long <FIELD NAME>.',
  USR_08: 'This is an invalid Credit Card.',
  USR_09: 'The Shipping Region ID is not number.',
  AUT_01: 'Authorization code is empty.',
  AUT_02: 'Access Unauthorized.',
  NOAUTH: 'NoAuth'

})
const NETWORK_CODES = Object.freeze({
  HTTP_SUCCESS: 200,
  HTTP_CREATED: 201,
  HTTP_BAD_REQUEST: 400,
  HTTP_UN_AUTHORISED: 401,
  HTTP_NOT_FOUND: 404,
  HTPP_INTERNAL_SERVER: 500

})

const CACHE_TYPES = Object.freeze({
  hour: 'hour',
  day: 'day'

})
const CACHE_HOUR = Object.freeze({
  one: 3600,
  twenty_hour: 86400

})

export default Object.assign({}, { ERROR_CODES, NETWORK_CODES, CACHE_TYPES, CACHE_HOUR })
