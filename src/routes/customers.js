import { Router } from 'express';
import { getCustomers, getOneCustomer, postCustomers, putCustomers } from '../controllers/customersControllers.js';
import validateCustomer from '../middlewares/customersMiddleware.js';

const router = Router();

router.get('/customers', getCustomers)
router.get('/customers/:id', getOneCustomer)
router.post('/customers', validateCustomer, postCustomers)
router.put('/customers/:id', validateCustomer, putCustomers)

export default router