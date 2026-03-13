import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/category.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getCategories);                                // público
router.post('/', verifyToken, isAdmin, createCategory);        // admin
router.delete('/:id', verifyToken, isAdmin, deleteCategory);   // admin

export default router;