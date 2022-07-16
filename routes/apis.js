const express = require('express');
const router = express.Router();

const { validateTrade } = require('../validate');

const Trade = require('../models/trades');
const User = require('../models/user');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const auth = require("../middleware/auth");

router.post('/trades',auth, (req, res) => {
    let tradeId=5;
    validateTrade(req.body);

    // Trade.find()
    //     .then((response) => {
    //         const userTrades = response.length > 0 ? response.map(trade => trade._id) : [];
    //         tradeId = userTrades.length > 0 ? Math.max.apply(null, userTrades) + 1 : 1;
    //     })
    //     .catch((err) => {
    //         throw err;
    //     })


    const record = { '_id': tradeId, 'timestamp': Math.floor(new Date().getTime()), ...req['body'] }

    Trade.create(record)
        .then((response) => {
            console.log('res', response)
        })
        .catch((error) => {
            throw error;
        })

    res.end('success')

})

router.post('/signup', async (req, res) => {
    try {
        // Get user input
        const { _id, email, password } = req.body;

        // Validate user input
        if (!(email && _id)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(400).send("User Already Exist. Please Login");
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
        const token = jwt.sign({ user_id: user._id, email }, 'secret', { expiresIn: "10m" });

        // return new user
        res.status(200).json({ userId: user._id, token });
    } catch (err) {
        throw err
    }
});

router.post('/login', async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        // Validate if user exist in our database
        const user = await User.findOne({ email });
        console.log(user)

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({ user_id: user._id, email }, 'secret', { expiresIn: "10m" });

            // user
            res.status(200).send({ userId: user._id, email: user.email, token });
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        throw err
    }
})

module.exports = router;