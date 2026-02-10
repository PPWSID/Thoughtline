import { Router } from 'express';
import usercontroller from '../controller/usercontroller.js';

import auth from '../middleware/auth.js';

const router = Router();

router.post('/register', auth.authMiddleware , usercontroller.registerUser);
router.post('/login', usercontroller.loginUser);

//ตัวอย่าง protected route
router.get('/profile', auth.authMiddleware, (req, res) => {
    res.json({ message: "This is a protected profile", user: (req as any).user });
});

export default router;
