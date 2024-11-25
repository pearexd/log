import errResponse from '../utils/errResponse.js'
import {Blog} from "../models/blog.model.js"
import sucResponse from '../utils/sucResponse.js'
import { createLog } from '../utils/audit.js'


// ADD BLOG
export const createBlog = async(req,res,next)=>{

    try {
        const {title,content} = req.body
        
        if(!title.trim() || !content.trim()){
            throw new errResponse('Title and Description are required',400)
        }

        const blog = await Blog.create({
            title,
            content,
            user:req.user._id
        })

        await blog.save()

        return res.json(new sucResponse('Blog added successfully',blog))
       
    } catch (error) {
        next(error)
    }
}

// DELETE BLOG 
// RBAC (Role Based Access Control) is implemented here
export const deleteBlog = async(req,res,next)=>{

    // Check if blog exist
    // check if the user deleting the blog is owner of the blog or admin or moderator
    // if owner or admin or moderator delete the blog
    // else unauthorized

    try {

        const {blogId} = req.body

        if(!blogId.trim()){
            throw new errResponse('Blog ID is required',400)
        }

        const blog = await Blog.findById(blogId)

        if(!blog){
            throw new errResponse('Blog not found',404)
        }

        if(blog.user.toString() == req.user._id.toString() || req.user.role == 'ADMIN'|| req.user.role == 'MODERATOR'){   
            await Blog.findOneAndDelete({_id:blogId})
            await createLog("BLOG DELETED",req.user.username,blogId)
        }        
        else{
            throw new errResponse('You are not authorized to delete this blog',403)
        }

        return res.json(new sucResponse('Blog deleted successfully'))

          
    } catch (error) {
        next(error)
    }
}

// GET BLOGS
export const getBlogs = async(req,res,next)=>{

    try {

        const blogs = await Blog.find()

        if(!blogs){
            throw new errResponse('No blogs found',404)
        }

        return res.json(new sucResponse('Blogs fetched successfully',blogs))

        
    } catch (error) {
        next(error)
    }

}