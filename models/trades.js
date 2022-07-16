const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const tradeSchema = new Schema(
    {
        _id:{
            type: Number,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        user_id:{
            type: Number,
            required: true
        },
        symbol:{
            type: String,
            required: true
        },
        shares:{
            type: Number,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        timestamp:{
            type: Date,
            required: true
        }
    }
)

const trade = mongoose.model('trades',tradeSchema);

/**
 * export
 */
module.exports = trade