import { Router } from 'express';
import favoritecontroller from '../controller/favoritecontroller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/toggle', auth.userPermission, favoritecontroller.toggleFavorite);
router.get('/getall', auth.userPermission, favoritecontroller.getFavorites);

export default router;
