import { Router } from 'express';
import { getUserSubscriptionById } from '../controllers/subscriptionController.js';

const router = Router();

router.get('/:id', getUserSubscriptionById); // GET /userSubscriptions/123
// router.post('/:id/updateSubscription', )

export default router;
