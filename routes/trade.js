const express = require('express');
const router = express.Router();

const { validateTrade } = require('../validate');

const Trade = require('../models/trades');

router.post('/trades', (req, res) => {
    let tradeId;
    validateTrade(req.body);

    Trade.find()
        .then((response) => {
            const userTrades = response.length > 0 ? response.map(trade => trade._id) : [];
            tradeId = userTrades.length > 0 ? Math.max.apply(null, userTrades) + 1 : 1;
        })
        .catch((err) => {
            throw err;
        })


    const record = { '_id': tradeId, 'timestamp': Math.floor(new Date().getTime()), ...req['body'] }

    console.log(record)
    Trade.create(record)
        .then((response) => {
            console.log('res', response)
        })
        .catch((error) => {
            throw error;
        })

    res.end('success')

})

module.exports = router;