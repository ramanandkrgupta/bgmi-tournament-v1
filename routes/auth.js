const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const session = require('express-session');

router.use(session({
    secret: 'YOUR_SECRET_KEY',
    resave: false,
    saveUninitialized: true,
}));

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, mobile, referredBy } = req.body;
        const user = new User({ username, email, password, mobile, referredBy });
        user.generateReferralCode();
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { mobile: identifier },
                { username: identifier }
            ]
        });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY');
        req.session.token = token;
        res.send({ token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;