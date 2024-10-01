const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
// const Team = require('../models/Team');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');


// // Middleware to authenticate user
router.use(authenticate);

// Utility function to get user ID from token
const getUserIdFromToken = (req) => {
    const token = req.headers.authorization.split(' ')[1]; // Assuming Bearer token
    const decodedToken = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace 'YOUR_SECRET_KEY' with your actual secret key
    return decodedToken.userId;
};


router.get('/profile', async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        
        // Fetch the user details by userId
        const userData = await User.findById(userId);  // Assuming `User` is your user model
        
        if (!userData) {
            return res.status(404).send('User not found');
        }

        res.send(userData);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;