import { Router } from 'express';
import { home } from '../controllers/index.js';
import userRoutes from './user.js';
import subscriptionRoutes from './subscription.js';

const router = Router();

router.use('/user', userRoutes);
router.use('/subscription', subscriptionRoutes);

router.get('/', home);

export default router;
