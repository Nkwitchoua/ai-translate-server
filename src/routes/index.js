import { Router } from 'express';
import { home } from '../controllers/index.js';
import userRoutes from './user.js';
import subscriptionRoutes from './subscription.js';
import translateRoutes from './translate.js';

const router = Router();

router.use('/user', userRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/translate', translateRoutes);

router.get('/', home);

export default router;
