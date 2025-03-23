import {Router} from 'express'
import { createBlog, createBlogV2, deleteBlog, getBlog, getBlogs } from '../controllers/blog.controller.js'
import {authMiddleware} from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js'


const router = Router()

//Private Endpoints
router.route('/createBlog').post 
router.route('/deleteBlog').post(authMiddleware,deleteBlog)
router.route('/v2/createBlog').post(upload.any(),createBlogV2)

//Public Endpoints
router.route('/getBlogs'   ).get (getBlogs  ) 
router.route('/getBlog/:id').get (getBlog  )
 
export default router