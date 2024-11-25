import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())


// Routes : any request that starts with /api/v1/{anything} will be redirected to function next to it

app.use('/api/v1/user',userRouter)


// Error Handler
app.use((err,req,res,next)=>{

    const statusCode = err.statusCode || 500 
    const message    = err.message    || "Something went wrong"
    const error      = err   

    return res.status(statusCode).json({
        statusCode,
        message,
        error
    })
    
})

export default app 