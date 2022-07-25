import { Router } from 'express';
import { getGames, postGames } from '../controllers/gamesControllers.js';
import validateGames from '../middlewares/gamesMiddleware.js';

const router = Router();

router.get('/games', getGames)
router.post('/games', validateGames, postGames)

export default router