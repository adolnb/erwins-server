import { Router } from 'express';
import { login, logout, register, verifyToken } from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js'; 
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { authRequired } from '../middlewares/validateToken.js';


const router = Router();


router.post('/login', validateSchema(loginSchema), login);
router.post('/register', validateSchema(registerSchema), register);
router.post('/verify-token', authRequired, verifyToken);
router.post('/logout', logout);


export default router;