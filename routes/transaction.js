const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');

// Middleware to authenticate user
router.use(authenticate);

// Add money to deposit wallet
router.post('/addDeposit', async (req, res) => {
    try {
        const { amount } = req.body;
        const transaction = new Transaction({
            user: req.user.id,
            amount,
            type: 'credit',
            description: 'Added money to deposit wallet'
        });
        await transaction.save();

        req.user.depositWallet += amount;
        await req.user.save();

        res.status(201).send('Money added to deposit wallet successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Add money to bonus wallet
router.post('/addBonus', async (req, res) => {
    try {
        const { amount } = req.body;
        const transaction = new Transaction({
            user: req.user.id,
            amount,
            type: 'credit',
            description: 'Added money to bonus wallet'
        });
        await transaction.save();

        req.user.bonusWallet += amount;
        await req.user.save();

        res.status(201).send('Money added to bonus wallet successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Add money to winnings wallet
router.post('/addWinnings', async (req, res) => {
    try {
        const { amount } = req.body;
        const transaction = new Transaction({
            user: req.user.id,
            amount,
            type: 'credit',
            description: 'Added money to winnings wallet'
        });
        await transaction.save();

        req.user.winningsWallet += amount;
        await req.user.save();

        res.status(201).send('Money added to winnings wallet successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Use money from deposit or bonus wallet to join a match or tournament
router.post('/use', async (req, res) => {
    try {
        const { amount, description, walletType } = req.body;
        if (walletType === 'deposit' && req.user.depositWallet < amount) {
            return res.status(400).send('Insufficient balance in deposit wallet');
        }
        if (walletType === 'bonus' && req.user.bonusWallet < amount) {
            return res.status(400).send('Insufficient balance in bonus wallet');
        }

        const transaction = new Transaction({
            user: req.user.id,
            amount,
            type: 'debit',
            description
        });
        await transaction.save();

        if (walletType === 'deposit') {
            req.user.depositWallet -= amount;
        } else if (walletType === 'bonus') {
            req.user.bonusWallet -= amount;
        }
        await req.user.save();

        res.status(201).send('Money used successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Withdraw money from winnings wallet
router.post('/withdraw', async (req, res) => {
    try {
        const { amount } = req.body;
        if (req.user.winningsWallet < amount) {
            return res.status(400).send('Insufficient balance in winnings wallet');
        }

        const transaction = new Transaction({
            user: req.user.id,
            amount,
            type: 'debit',
            description: 'Withdrawal from winnings wallet'
        });
        await transaction.save();

        req.user.winningsWallet -= amount;
        await req.user.save();

        res.status(201).send('Money withdrawn successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;