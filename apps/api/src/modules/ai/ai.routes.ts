import { Router } from 'express';
import { AiController } from './ai.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();
const aiController = new AiController();

router.use(protect);

router.post('/generate-tasks', aiController.generateTasks);
router.post('/analyze-risk', aiController.analyzeRisk);

export default router;
