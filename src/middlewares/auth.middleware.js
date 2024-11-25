import { User } from "../models/user.model.js"
import errResponse from "../utils/errResponse.js"
import jwt from "jsonwebtoken"

export const authMiddleware = async (req,res,next)=>{

    try {
        
          const {accessToken}    = req.cookies
          const JWT_SECRET = process.env.JWT_SECRET 
         //  const token = req.header("Authorization").split[" "] req.header("Authorization") gives single header req.headers give all headers 

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

          req.user = user
          next()
        
    } catch (error) {

        next(error)
    }

}

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