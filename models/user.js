const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const userSchema = new Schema(
    {
        _id:{
            type: Number,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        }
    }
)

const user = mongoose.model('users',userSchema);

module.exports = user