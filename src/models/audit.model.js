import mongoose from "mongoose"

// Audit Schema
const auditSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    target:{
        type:String,
    }
},
{
    timestamps: true
})

export const Audit = mongoose.model("Audit",auditSchema)