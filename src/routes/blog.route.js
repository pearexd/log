import {Router} from 'express'
import { createBlog, createBlogV2, deleteBlog, getBlog, getBlogs } from '../controllers/blog.controller.js'
import {authMiddleware} from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js'


const router = Router()

//Private Endpoints
router.route('/createBlog').post(authMiddleware,createBlog)
router.route('/deleteBlog').post(authMiddleware,deleteBlog)



//Public Endpoints
router.route('/getBlogs'   ).get (getBlogs  ) 
router.route('/getBlog/:id').get (getBlog  )
 
export default router