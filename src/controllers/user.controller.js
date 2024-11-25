import errResponse from "../utils/errResponse.js";
import sucResponse from "../utils/sucResponse.js"
import {createLog} from "../utils/audit.js"
import { User } from "../models/user.model.js";


// Create a new user
export const createUser = async(req,res,next) => {

    // get the user
    // check whether inputs are empty
    // check whether user exists
    // create a new user
    // save the user

    try {

        const {username,password} = req.body;

        if(!username.trim() || !password.trim()){
           throw new errResponse("Please provide a username and password",400)
        }

        const ifUserExists = await User.findOne({username})

        if(ifUserExists){
            throw new errResponse("User already exists",400)
        }

        const newUser = new User({
            username,
            password
        })

        await newUser.save()

        return res.json( new sucResponse("User created successfully", 201))
        
    } catch (error) {
        next(error)
    }
}

// Login a user
export const loginUser = async(req,res,next) => {

    // get the username and password
    // check whether inputs are empty
    // check whether user exists
    // check whether password is correct
    // generate a token
    // return the token

    try {
        const {username,password} = req.body;

        if(!username.trim() || !password.trim()){
            throw new errResponse("Please provide a username and password",400)
         }

        const user = await User.findOne({username}).select("+password")

        if(!user){
            throw new errResponse("User does not exist",400)
        }

        const isMatch = await user.matchPassword(password)

        if(!isMatch){
            throw new errResponse("Invalid credentials",400)
        }

        const token = await user.getSignedToken()

        const loggedInUserDetails = await User.findOne({username})

        const options = {
            httpOnly:true,
            secure:true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        return res
        .cookie("accessToken",token,options)
        .status(200)
        .json(
            new sucResponse(true,200,"User Login Success",{loggedInUserDetails,token})
        )

        
    } catch (error) {
        next(error)
    }
}

// Logout a user
export const logout = async(req,res)=>{
    
    return res
    .status(200)
    .clearCookie("accessToken")
    .json(new sucResponse(200,"User logged out successfully")) 

}

// Get all users 

export const getUsers = async(req,res,next) => {
    
        try {
            const users = await User.find({})
            return res.json(new sucResponse("Users fetched successfully",200,users))
            
        } catch (error) {
            next(error)
        }
}



//ADMIN ROUTES

// Roles are assigend here
export const assignModerator = async(req,res,next) => {

    // get the username
    // check whether inputs are empty
    // check whether user exists
    // assign the role

    try {
        const {id} = req.body;

        if(!id.trim()){
            throw new errResponse("Please provide Id",400)
        }

        const user = await User.findById(id)

        if(!user){
            throw new errResponse("User does not exist",400)
        }

        user.role = "MODERATOR"

        await createLog("MODERATOR ADDED",req.user.username,user.username)

        await user.save()

        return res.json(new sucResponse("User role updated successfully",200,user))
        
    } catch (error) {
        next(error)
    }
}

// Remove a role
export const removeModerator = async(req,res,next) => {
    
        // get the username
        // check whether inputs are empty
        // check whether user exists
        // remove the role
    
        try {
            const {id} = req.body;
    
            if(!id.trim()){
                throw new errResponse("Please provide Id",400)
            }
    
            const user = await User.findById(id)
    
            if(!user){
                throw new errResponse("User does not exist",400)
            }
    
            user.role = "USER"

            await createLog("MODERATOR REMOVED",req.user.username,user.username)
    
            await user.save()
    
            return res.json(new sucResponse("User role updated successfully",200,user))
            
        } catch (error) {
            next(error)
        }
}

//Ban User
export const banUser = async(req,res,next) =>{

    try {

        const {id} = req.body;

        if(!id.trim()){
            throw new errResponse("Please provide Id",400)
        }

        const user = await User.findById(id)

        if(!user){
            throw new errResponse("User does not exist",400)
        }

        user.ban = true

        await createLog("USER BANNED",req.user.username,user.username)

        await user.save()

        return res.json(new sucResponse("User banned successfully",200,user))
        
    } catch (error) {
        next(error)
    }

}

// Unban User
export const unbanUser = async(req,res,next) =>{

    try {

        const {id} = req.body;

        if(!id.trim()){
            throw new errResponse("Please provide Id",400)
        }

        const user = await User.findById(id)

        if(!user){
            throw new errResponse("User does not exist",400)
        }

        user.ban = false

        await createLog("USER UNBANNED",req.user.username,user.username)

        await user.save()

        return res.json(new sucResponse("User unbanned successfully",200,user))
        
    } catch (error) {
        next(error)
    }

}





