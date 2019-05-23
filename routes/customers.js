import { Router } from 'express'
import validate from '../middlewares/validateRequest'
import controller from '../controllers/customer'
import authenticate from '../middlewares/authenticate'

const router = Router()

router.route('/customer').get(authenticate.verifyUser, controller.getCustomer())
router.route('/customers').post(validate, controller.signupCustomer())
  .put(authenticate.verifyUser, validate, controller.updateCustomerBiodata())

router.post('/customers/login', validate, controller.loginCustomer())

// router.put('/creditCard', authenticate.verifyUser, validate, controller.updateCustomerCreditCard())

// router.put('/address', authenticate.verifyUser, validate, controller.updateCustomerAddress())
router.post('/customers/facebook', validate, controller.facebookLogin())

export default router
