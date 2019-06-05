import request from 'supertest'
import app from '../../index'
import axios from 'axios'
import constants from '../../constants'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

let token
const baseUrl = '/v1/api'

describe('Customer Routes test', () => {
  describe('Sign up Routes', () => {
    it('should register user with valid credentials', async () => {
      const response = await request(app)
        .post(`${baseUrl}/customers`)
        .send({
          name: 'test',
          email: 'test@test.com',
          password: '12345678'
        })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_CREATED)
      expect(response.body).toBeTruthy()
    })

    it('should not register users that are already registered', async () => {
      const response = await request(app)
        .post(`${baseUrl}/customers`)
        .send({
          name: 'test',
          email: 'test@test.com',
          password: '12345678'
        })
      expect(response.body.message).toEqual('The email already exists.')
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    })

    it('should not register customers with incorrect credentials', async () => {
      const response = await request(app)
        .post(`${baseUrl}/customers`)
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    })
  })

  describe('Login Routes test', () => {
    it('should login a user with the correct credentials', async () => {
      const response = await request(app)
        .post(`${baseUrl}/customers/login`)
        .send({
          email: 'test@test.com',
          password: '12345678'
        })
      token = response.body.accessToken
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_SUCCESS)
      expect(response.body).toBeTruthy()
    })

    it('should not login a user with the incorrect credentials', async () => {
      const response = await request(app)
        .post(`${baseUrl}/customers/login`)
        .send({
          email: 'test@test.com',
          password: '1234'
        })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    })

    it('should not login a user with the empty credentials', async () => {
      const response = await request(app)
        .post(`${baseUrl}/customers/login`)
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    })

    it('should not login a user who is not registered', async () => {
      const response = await request(app)
        .post(`${baseUrl}/customers/login`)
        .send({
          email: 'tester@test.com',
          password: '1234dddd'
        })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    })
  })

  describe('Update Address Route block', () => {
    it('should update address for a customer that is authenticated', async () => {
      const response = await request(app)
        .put(`${baseUrl}/customers/address`)
        .set({ USER_KEY: token })
        .send({
          address_1: '24 Lagos',
          address_2: 'City of Lagos',
          city: 'Lagos',
          region: 'Lagos',
          postal_code: '234Lagos',
          shipping_region_id: 2,
          country: 'Nigeria'
        })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_SUCCESS)
    })

    it('should not update address for a customer that is not authenticated', async () => {
      const response = await request(app)
        .put(`${baseUrl}/customers/address`)
        .set({ USER_KEY: token })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    })

    it('should not update address for an invalid user token', async () => {
      const response = await request(app)
        .put(`${baseUrl}/customers/address`)
        .set({ USER_KEY: 'joshua' })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_UN_AUTHORISED)
    })

    it('should not update address for a user with empty user token', async () => {
      const response = await request(app)
        .put(`${baseUrl}/customers/address`)
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_UN_AUTHORISED)
    })
  })

  describe('Get Customer', () => {
    it('should get a registered user with valid token', async () => {
      const response = await request(app)
        .get(`${baseUrl}/customer`)
        .set({ USER_KEY: token })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_SUCCESS)
    })
  })

  describe('Update Customer CreditCard', () => {
    it('should update customers creditcard with right credentials', async () => {
      const response = await request(app)
        .put(`${baseUrl}/customers/creditCard`)
        .set({ USER_KEY: token })
        .send({ credit_card: '123456789012' })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_SUCCESS)
    })

    it('should not update customers with invalid credit card credentials', async () => {
      const response = await request(app)
        .put(`${baseUrl}/customers/creditCard`)
        .set({ USER_KEY: token })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    })
  })

  describe('UpdatecustomerDetails', () => {
    it('should update customer details with correct credentials', async () => {
      const response = await request(app)
        .put(`${baseUrl}/customer`)
        .set({ USER_KEY: token })
        .send({
          name: 'test',
          email: 'test@test.com',
          password: '12345678samuel',
          mob_phone: 'my-mobile-number',
          eve_phone: 'my-eve-phone',
          day_phone: 'my_phone_number'
        })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_SUCCESS)
    })

    it('should not update customer details with empty credentials', async () => {
      const response = await request(app)
        .put(`${baseUrl}/customer`)
        .set({ USER_KEY: token })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    })
  })

  describe('Facebook Login Test', () => {
    it('should register a customer with correct accesstoken', async () => {
      const mockedResponse = {
        email: 'samuel@gorilla.com',
        name: 'Samuel Gorilla'
      }
      mock.onGet('https://graph.facebook.com/me?fields=name,gender,location,email&access_token=samuel').reply(200, mockedResponse)

      const response = await request(app)
        .post(`${baseUrl}/customers/facebook`)
        .send({ access_token: 'samuel' })
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_CREATED)
    })

    it('should  will not register a customer with incorrect accesstoken', async () => {
      const response = await request(app)
        .post(`${baseUrl}/customers/facebook`)
      expect(response.statusCode).toEqual(constants.NETWORK_CODES.HTTP_BAD_REQUEST)
    })
  })
})
