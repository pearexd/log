import app from "./app.js"
import { connectToDatabase } from "./db/db.js"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT 

connectToDatabase()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is up and running on PORT : ${PORT}`)
    })
})
.catch((err)=>{
    console.log(`Some unexpected error has occured while connecting to DB : ${err}`)
    
})