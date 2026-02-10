import mongoose, { Schema } from 'mongoose'

const articleSchema = new Schema({
        title : { type: String },
        content : { type: String },
        author : { type: String },
        is_active : { type: Boolean },
    }, 
    {
        timestamps: true
    }
);

const articleModel = mongoose.model('article', articleSchema, 'article')

export default articleModel