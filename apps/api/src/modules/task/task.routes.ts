import { Router } from 'express';
import { TaskController } from './task.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();
const taskController = new TaskController();

router.use(protect);

router.post('/', taskController.create);
router.get('/', taskController.listProjectTasks);
router.get('/:id', taskController.getOne);
router.patch('/:id', taskController.update);
router.patch('/:id/move', taskController.move);
router.delete('/:id', taskController.delete);

export default router;
