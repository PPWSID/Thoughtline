import { Router } from 'express';
import articlecontroller from '../controller/articlecontroller.js';
import auth from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', articlecontroller.getAllArticle);
router.get('/:id', articlecontroller.getArticleById);

// Protected routes
router.post('/', articlecontroller.createArticle);
router.put('/:id', auth.authMiddleware, articlecontroller.updateArticle);
router.delete('/:id', auth.authMiddleware, articlecontroller.deleteArticle);

export default router;
