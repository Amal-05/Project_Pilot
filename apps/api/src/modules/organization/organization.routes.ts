import { Router } from 'express';
import { OrganizationController } from './organization.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();
const organizationController = new OrganizationController();

router.use(protect);

router.post('/', organizationController.create);
router.get('/', organizationController.listMine);
router.get('/:id', organizationController.getOne);
router.patch('/:id', organizationController.update);
router.delete('/:id', organizationController.delete);

router.post('/:id/invite', organizationController.invite);
router.get('/:id/members', organizationController.getMembers);
router.patch('/:id/members/:userId', organizationController.updateMemberRole);
router.delete('/:id/members/:userId', organizationController.removeMember);

router.post('/invitations/accept', organizationController.acceptInvitation);

export default router;
