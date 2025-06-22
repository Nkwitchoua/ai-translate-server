import { Router } from 'express';
import { translateText } from '../controllers/translateController.js';

const router = Router();

router.post('/translateText', translateText); // POST /translateText

export default router;
