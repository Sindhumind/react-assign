import { Router } from 'express';
import * as userController from '../controllers/userController';
import upload from '../middleware/upload';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateImageSignature } from '../middleware/validateImageSignature';
import { doubleCsrfProtection } from '../middleware/csrfProtection';

const router = Router();

router.get(
  '/',
  authenticateToken,
  userController.getUsers,
);

router.get(
  '/:id',
  authenticateToken,
  userController.getUserById,
);

router.post(
  '/',
  authenticateToken,
  doubleCsrfProtection,
  upload.single('profile_photo'),
  validateImageSignature,
  userController.createUser,
);

router.put(
  '/:id',
  authenticateToken,
  doubleCsrfProtection,
  upload.single('profile_photo'),
  validateImageSignature,
  userController.updateUser,
);

router.delete(
  '/:id',
  authenticateToken,
  doubleCsrfProtection,
  userController.deleteUser,
);
export default router;