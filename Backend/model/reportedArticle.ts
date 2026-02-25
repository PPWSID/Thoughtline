import mongoose, { Schema } from 'mongoose'

const reportedArticleSchema = new Schema({
        articleId : { type: String },
        reason_type : { type : String},
        reason : { type: String },
        reported_by : { type: String },
    }, 
    {
        timestamps: true
    }
);  

const reportedArticleModel = mongoose.model('reportedArticle', reportedArticleSchema, 'reportedArticle')

export default reportedArticleModel