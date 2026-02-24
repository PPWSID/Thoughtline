import { Router } from 'express';
import usercontroller from '../controller/usercontroller.js';

import auth from '../middleware/auth.js';

const router = Router();

router.post('/register' , usercontroller.registerUser);
router.post('/login', usercontroller.loginUser);
router.post('/logout', usercontroller.logoutUser);

// Profile routes
router.get('/getprofile', auth.userPermission, usercontroller.getProfile);
router.put('/updateprofile', auth.userPermission, usercontroller.updateProfile);

export default router;
