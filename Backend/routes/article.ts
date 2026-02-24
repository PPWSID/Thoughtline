import { Router } from 'express';
import articlecontroller from '../controller/articlecontroller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/getall', articlecontroller.getAllArticle); // get all article
router.get('/getbyid/:id', articlecontroller.getArticleById); // get article by id
router.post('/create', auth.userPermission, articlecontroller.createArticle); // create article
router.put('/updatebyid/:id', auth.userPermission, articlecontroller.updateArticle); // update article
router.delete('/deletebyid/:id', auth.userPermission, articlecontroller.deleteArticle); // delete article
router.get('/getbyown', auth.userPermission, articlecontroller.getOwnArticle); // get own article
router.post('/getbyfilter', articlecontroller.getArticleByFilter); // get article by filter
router.get('/getall-article',auth.userPermission, articlecontroller.getAllArticleWithLogin) // get all article with login
export default router;
