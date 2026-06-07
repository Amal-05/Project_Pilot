import { Router } from 'express';
import { AuthController } from './auth.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', protect, authController.getMe);

export default router;
