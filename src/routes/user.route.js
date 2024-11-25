import Router from 'express';
import { createUser, loginUser, logout } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router()


// Public Endpoints


router.route('/signup').post(createUser)
router.route('/login').post(loginUser)
router.route('/logout').post(authMiddleware,logout)






export default router