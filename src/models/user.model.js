import mongoose from "mongoose"
import jwt from "jsonwebtoken"


// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER","MODERATOR"],
        default: "USER",
    },
    profilePicture: {
        type: String,
        default: "",
    }

})


// This functions hashes the password before saving it to the database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// This function compares the entered password with the hashed password in the database
userSchema.methods.matchPassword = userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}   



// Generating JWT token
userSchema.methods.getSignedToken = function(){

    return jwt.sign({
        id: this._id,
    },
     process.env.JWT_SECRET,
    {
        expiresIn:'7d'
    })
}


export const User = mongoose.model("User",userSchema)
