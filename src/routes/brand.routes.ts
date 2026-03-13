import { Router } from 'express';
import { getBrands, createBrand, deleteBrand } from '../controllers/brand.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getBrands);                              // público
router.post('/', verifyToken, isAdmin, createBrand);     // admin
router.delete('/:id', verifyToken, isAdmin, deleteBrand); // admin

export default router;