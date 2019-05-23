import { Router } from 'express'
import validate from '../middlewares/validateRequest'
import controller from '../controllers/customer'
import authenticate from '../middlewares/authenticate'

const router = Router()

router.route('/customer')
  .get(authenticate.verifyUser, controller.getCustomer())
  .put(authenticate.verifyUser, validate, controller.updateCustomerDetails())
router.route('/customers').post(validate, controller.signupCustomer())

router.put('/customers/address', authenticate.verifyUser, validate, controller.updateCustomerAddress())

router.post('/customers/login', validate, controller.loginCustomer())

router.put('/customers/creditCard', authenticate.verifyUser, validate, controller.updateCustomerCreditCard())
router.post('/customers/facebook', validate, controller.facebookLogin())

export default router
