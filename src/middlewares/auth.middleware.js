import { User } from "../models/user.model.js"
import errResponse from "../utils/errResponse.js"
import jwt from "jsonwebtoken"

// Middle to check if user has the token 
export const authMiddleware = async (req,res,next)=>{

    try {
        
          let accessToken 

          if(req.cookies?.accessToken){
             accessToken = req.cookies?.accessToken
          }else{
            accessToken = req.header("Authorization")?.split(" ")[1]
          }
          
          const JWT_SECRET = process.env.JWT_SECRET 
          
          if(!accessToken){
            throw new errResponse("Unauthenticated",400)
          }

          const {id} = jwt.verify(accessToken,JWT_SECRET)

          if(!id){
            throw new errResponse("Unauthenticated",400)
          }

          const user = await User.findById(id).select("+role")


          if(!user){
            throw new errResponse("User not found",400)
          }

          if(user.ban == true){
            throw new errResponse("Sorry you cannot access",400)
          }

          req.user = user
          next()
        
    } catch (error) {

        next(error)
    }

}

//Admin Middleware check if the current user is admin if not return
export const adminMiddleware = async (req,res,next)=>{
    try {
        
        if(req.user.role !== "ADMIN"){
            throw new errResponse("Unauthorized",401)
        }

        next()
        
    } catch (error) {
        next(error)
    }
}