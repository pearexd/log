import errResponse from '../utils/errResponse.js'
import {Blog} from "../models/blog.model.js"
import sucResponse from '../utils/sucResponse.js'
import { createLog } from '../utils/audit.js'
import { uploadImageToAwsS3 } from '../utils/image.uploader.js'




// Convert date and time to readable format

const convertDateAndTimeReadable = (blogs)=>{

    return blogs.map(blog=>{
        const readableDate = blog.createdAt.toDateString()
        const readableTime = blog.createdAt.toLocaleTimeString("en-US",{timeZone:"Asia/Kolkata"})
        return {
            ...blog._doc,
            readableDate,
            readableTime
        }
    })
}



// ADD BLOG
export const createBlog = async(req,res,next)=>{

    try {
        const {title,content} = req.body
        
        if(!title.trim() || !content.trim()){
            throw new errResponse('Title and Description are required',400)
        }

        const blog = await Blog.create({
            title,
            content
        })

        await blog.save()

        return res.json(new sucResponse(true,200,'Blog added successfully',blog))
       
    } catch (error) {
        next(error)
    }
}


export const createBlogV2 = async(req,res,next) =>{

    try {
        const body = req.body
        const files = req.files
        const {title} = body;
        
        delete body.title
    
        const output = {}
     
        Object.keys(body).map((key)=>{
            try {
                output[key] = JSON.parse(body[key])
            } catch (error) {
                output[key] = body[key]
            }
        })
    
        const imageURLs = []
        const content   = []
    
        await Promise.all(files.map(async (file)=>{ 
            const obj = await uploadImageToAwsS3(file)
            imageURLs.push(obj)
        }))
    
        
        Object.keys(output).map((key)=>{
            const obj = {
                order : key ,
                data : output[key].data ? output[key].data : output[key],
                inputType : output[key].inputType ? output[key].inputType : 'image' ,
                style : output[key].style,
                url: ''
            }
            content.push({...obj})
        })
    
    
        content.map((obj)=>{
            imageURLs.map((imageObject)=>{
                if (obj.order == imageObject.order){
                    obj.url = imageObject.url
                }    
            })
        })
    
        const blog = await Blog.create({
            title,
            content
        })
    
        await blog.save()
    
        return res.json(new sucResponse(true,200,'Blog added successfully',blog))
        
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

        if(req.user.role == 'ADMIN'|| req.user.role == 'MODERATOR'){   
            await Blog.findOneAndDelete({_id:blogId})
            await createLog("BLOG DELETED",req.user.username,blogId)
        }        
        else{
            throw new errResponse('You are not authorized to delete this blog',403)
        }

        return res.json(new sucResponse(true,200,'Blog deleted successfully'))

          
    } catch (error) {
        next(error)
    }
}

// GET BLOGS
export const getBlogs = async(req,res,next)=>{

    try {

        const blogs = await Blog.find().select("-content")

        if(!blogs){
            throw new errResponse('No blogs found',404)
        }

        const multipleBlogsWithReadableDateAndTime = convertDateAndTimeReadable(blogs)

        return res.json(new sucResponse(true,200,'Blogs fetched successfully',multipleBlogsWithReadableDateAndTime))

        
    } catch (error) {
        next(error)
    }

}

export const getBlog = async(req,res,next)=>{

    try {

        const {id} = req.params
        let blogVersioned = {}

        if(!id.trim()){
            throw new errResponse('Blog ID is required',400)
        }

        const blog = await Blog.findById(id)

        if(!blog){
            throw new errResponse('Blog not found',404)
        }

        const singleBlogWithReadableDateAndTime = convertDateAndTimeReadable([blog])

        return res.json(new sucResponse(true,200,'Blog fetched successfully',singleBlogWithReadableDateAndTime[0]))

        
    } catch (error) {
        next(error)
    }

}