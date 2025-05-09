import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

// Todas as rotas de usuário agora são públicas
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);

export default router;