import { Router } from 'express';
import { getUsers, deleteUser } from '../controllers/user.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken, isAdmin, getUsers);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;