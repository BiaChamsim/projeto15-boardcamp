import { Router } from 'express';
import { getRentals, postRentals, finishRentals, deleteRentals } from '../controllers/rentalsControllers.js';
import validateRentals from '../middlewares/rentalsMiddleware.js'

const router = Router();

router.get('/rentals', getRentals)
router.post('/rentals', validateRentals, postRentals)
router.post('/rentals/:id/return', finishRentals)
router.delete('/rentals/:id', deleteRentals)


export default router