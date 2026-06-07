import { Router } from 'express';
import { ProjectController } from './project.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();
const projectController = new ProjectController();

router.use(protect);

router.post('/', projectController.create);
router.get('/', projectController.listOrganizationProjects);
router.get('/:id', projectController.getOne);
router.patch('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router;
