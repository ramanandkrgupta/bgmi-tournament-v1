const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');

// Middleware to authenticate user
router.use(authenticate);

// Add money to user account
router.post('/add', async (req, res) => {
    try {
        const { amount } = req.body;
        const transaction = new Transaction({
            user: req.user.id,
            amount,
            type: 'credit',
            description: 'Added money to account'
        });
        await transaction.save();

        req.user.earnings += amount;
        await req.user.save();

        res.status(201).send('Money added to account successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Use money to join a match or tournament
router.post('/use', async (req, res) => {
    try {
        const { amount, description } = req.body;
        if (req.user.earnings < amount) {
            return res.status(400).send('Insufficient balance');
        }
        const transaction = new Transaction({
            user: req.user.id,
            amount,
            type: 'debit',
            description
        });
        await transaction.save();

        req.user.earnings -= amount;
        await req.user.save();

        res.status(201).send('Money used successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;