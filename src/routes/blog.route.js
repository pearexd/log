import {Router} from 'express'
import { createBlog, deleteBlog, getBlogs } from '../controllers/blog.controller.js'
import {authMiddleware} from "../middlewares/auth.middleware.js"


const router = Router()

//Private Endpoints
router.route('/createBlog').post(authMiddleware,createBlog)
router.route('/deleteBlog').post(authMiddleware,deleteBlog)

//Public Endpoints
router.route('/getBlogs'   ).get (getBlogs  ) 
 
export default router