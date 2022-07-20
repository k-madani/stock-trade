const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { validateTrade } = require('../validate');
const Trade = require('../models/trades');
const User = require('../models/user');
const auth = require('../middleware/auth');


//get user Id from the token
const getUserId = async (authorization) => {
    const token = authorization;
    const decodedToken = jwt.decode(token, { complete: true });

    return decodedToken.payload.user_id;
}

//register a user
router.post('/signup', async (req, res) => {
    try {
        // Get user input
        const { _id, email, password } = req.body;

        // Validate user input
        if (!(email && _id)) {
            res.status(400).json({ Error: 'All input is required' });
        }

        // check if user already exist
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(400).json({ Error: 'User Already Exist. Please Login' });
        }

        //Encrypt user password
        const salt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(password, salt);

        // Create user in our database
        const user = await User.create({
            _id,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign({ user_id: user._id, email }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });

        // return new user
        res.status(200).json({ userId: user._id, token });
    } catch (err) {
        throw err
    }
});

//login a user
router.post('/login', async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).json({ Error: 'All input is required' });
        }

        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({ user_id: user._id, email }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
            // user
            res.status(200).json({ userId: user._id, email: user.email, token });
        } else {
            res.status(400).json({ Error: 'Invalid Credentials' });
        }
    } catch (err) {
        throw err
    }
});

//create a trade 
router.post('/trades', auth, async (req, res) => {
    let tradeId;
    req.body.type = req.body.type.toLowerCase();
    const validatedResult = validateTrade(req.body);

    if (Object.keys(validatedResult).length === 0) {
        const userId = await getUserId(req.headers.authorization);

        if (userId !== req.body.user_id) {
            res.status(400).json({ Error: 'user Id does not match' });
        } else {
            try {
                const response = await Trade.find();
                const userTrades = response.length > 0 ? response.map(trade => trade._id) : [];
                tradeId = userTrades.length > 0 ? Math.max.apply(null, userTrades) + 1 : 1;
            } catch (err) {
                throw err;
            }

            const record = { '_id': tradeId, 'timestamp': Math.floor(new Date().getTime()), ...req['body'] }



            Trade.create(record)
                .then((response) => {
                    res.status(201).json(response)
                })
                .catch((error) => {
                    throw error;
                })
        }
    } else {
        res.status(400).json(validatedResult);
    }

});

//get a trade 
router.get(`/trades`, auth, async (req, res) => {
    let query = {};
    const type = req.query.type;
    const user_id = parseInt(req.query.user_id);

    const userIdFromHeaders = await getUserId(req.headers.authorization);

    if (user_id && (userIdFromHeaders !== user_id)) {
        res.status(400).json({ Error: 'user Id does not match' });
    } else {
        if (type && user_id) {
            query = { type: type, user_id: user_id };
        } else if (user_id && !type) {
            query = { user_id: user_id }
        } else if (!user_id && type) {
            query = { type: type }
        } else {
            query = { user_id: userIdFromHeaders }
        }

        Trade.find(query)
            .sort({ _id: 1 })
            .then((trades) => {
                res.json(trades)
            })
            .catch((error) => {
                throw error
            })
    }
});

//get trade with Id
router.get(`/trades/:_id`, auth, async (req, res) => {
    console.log('Getting trade with id');

    const userId = await getUserId(req.headers.authorization);

    Trade.find({ _id: req.params._id, user_id: userId })
        .then((trades) => {
            if (trades.length !== 0) {
                res.json(trades)
            } else {
                res.status(404).json({ Error: 'There is no trade yet with this trade id' })
            }

        })
        .catch((error) => {
            throw error
        })
});

//delete trade 
router.delete(`/trades/:_id`, auth, function (_, res) {
    res.status(405).json({ Error: 'Deletion of trade is not allowed' })
});

//patch trade
router.patch(`/trades/:_id`, auth, function (_, res) {
    res.status(405).json({ Error: 'Modification of trade is not allowed' })
});

//put trade
router.put(`/trades/:_id`, auth, function (_, res) {
    res.status(405).json({ Error: 'Modification of trade is not allowed' })
});

/**
 * export
 */
module.exports = router;