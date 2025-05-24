import { Router } from 'express';
import { createUserAsync, getUserById, updateUserAsync } from '../controllers/userController.js';

const router = Router();

router.get('/:id', getUserById);         // GET /user/123
router.post('/', createUserAsync);
router.put('/:id', updateUserAsync);

export default router;
