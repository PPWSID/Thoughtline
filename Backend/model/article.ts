import mongoose, { Schema } from 'mongoose'

const articleSchema = new Schema({
        title : { type: String },
        excerpt : { type: String },
        content : { type: String },
        coverImage : { type: String },
        category : { type: String },
        author : { type: String },
        is_active : { type: Boolean },
        created_by : { type: String },
        updated_by : { type: String },
    }, 
    {
        timestamps: true
    }
);

const articleModel = mongoose.model('article', articleSchema, 'article')

export default articleModel