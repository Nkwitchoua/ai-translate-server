import { Router } from 'express';
import { translateAudio, translateImage, translateText } from '../controllers/translateController.js';
import { uploadMiddleware } from '../middleware/multerConfig.js';

const router = Router();

router.post('/translateText', translateText); // POST /translateText
router.post('/translateAudio', uploadMiddleware, translateAudio); // POST /translateAudio
router.post('/translateImage', translateImage); // POST /translateImage

export default router;
