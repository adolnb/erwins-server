import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authRequired } from '../middlewares/validateToken.js';


const router = Router();


router.get('/users', authRequired, getUsers);
router.get('/users/:id', authRequired, getUser);
router.post('/users', authRequired, createUser);
router.put('/users/:id', authRequired, updateUser);
router.delete('/users/:id', authRequired, deleteUser);


export default router;