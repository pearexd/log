import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"
import blogRouter from "./routes/blog.route.js"
import rateLimit from "express-rate-limit"
import { upload } from "./middlewares/multer.middleware.js"
import { createBlogV2 } from "./controllers/blog.controller.js"
import { authMiddleware } from "./middlewares/auth.middleware.js"

dotenv.config()

const app = express()

// limit each IP to 50 requests per sec
const rateLimiter = rateLimit({
    windowMs: 1000, 
    max: 50, 
    message: "Too many requests from this IP, please try again after 15 minutes"
})

app.use(rateLimiter)

app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))


// Routes : any request that starts with /api/v1/{anything} will be redirected to function next to it
app.use('/api/v1/user',userRouter)
app.use('/api/v1/blog',blogRouter)

app.post('/api/v2/blog/createBlog',authMiddleware,upload.any(),createBlogV2)


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