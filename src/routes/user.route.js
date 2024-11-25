import Router from 'express';
import { assignModerator, banUser, createUser, getUsers, loginUser, logout, removeModerator, unbanUser } from '../controllers/user.controller.js';
import { adminMiddleware, authMiddleware } from '../middlewares/auth.middleware.js';
import { getAuditLogs } from '../controllers/audit.controller.js';


const router = Router()


// Public Endpoints
router.route('/signup').post(createUser)
router.route('/login' ).post(loginUser )
router.route('/users' ).get(getUsers  )


// Private Endpoints
router.route('/logout').post(authMiddleware,logout)


// ADMIN Endpoints
router.route('/addMod'   ).post(authMiddleware,adminMiddleware,assignModerator)
router.route('/removeMod').post(authMiddleware,adminMiddleware,removeModerator)

router.route('/ban'  ).post(authMiddleware,adminMiddleware,banUser     )
router.route('/unban').post(authMiddleware,adminMiddleware,unbanUser   )
router.route('/logs' ).get (authMiddleware,adminMiddleware,getAuditLogs)





export default router