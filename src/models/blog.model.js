import mongoose from 'mongoose';


// Blog Schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: []
},{
    timestamps:true
})

export const Blog = mongoose.model('Blog', blogSchema);