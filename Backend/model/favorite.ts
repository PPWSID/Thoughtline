import mongoose, { Schema } from 'mongoose'

const favoriteSchema = new Schema({
        userId : { type: Schema.Types.ObjectId, ref: 'user', required: true },
        articleId : { type: Schema.Types.ObjectId, ref: 'article', required: true },
    }, 
    {
        timestamps: true
    }
);

// ป้องกันการกด Fav ซ้ำซ้อน
favoriteSchema.index({ userId: 1, articleId: 1 }, { unique: true });

const favoriteModel = mongoose.model('favorite', favoriteSchema, 'favorite')

export default favoriteModel
