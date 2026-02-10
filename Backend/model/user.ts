import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
        role : { type: String, enum: ['user', 'dev', 'admin'], default: 'user'},
        name : { type: String },
        email : { type: String },
        user_name : { type: String },
        password : { type: String },
        level : { type: Number },
        is_active : { type: Boolean },
        login_by : { type: String },
        token : { type: String },
    }, 
    {
        timestamps: true
    }
);

const userModel = mongoose.model('user', userSchema, 'user')

export default userModel