import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())


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