import { Router } from 'express';
import { SprintController } from './sprint.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();
const sprintController = new SprintController();

router.use(protect);

router.post('/', sprintController.create);
router.get('/', sprintController.list);
router.patch('/:id/start', sprintController.start);
router.patch('/:id/complete', sprintController.complete);

export default router;
