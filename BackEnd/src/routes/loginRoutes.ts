
import { Router } from 'express';
import { login } from '../controllers/loginController';
import loginRateLimiter from '../middleware/loginRateLimiter';
import { authenticateToken } from '../middleware/authMiddleware';
import { logout, checkSession } from '../controllers/sessionController';
import { doubleCsrfProtection } from '../middleware/csrfProtection';

const router = Router();

router.post('/', loginRateLimiter, doubleCsrfProtection, login);
router.post('/logout', doubleCsrfProtection, logout);
router.get('/session', authenticateToken, checkSession);

export default router;