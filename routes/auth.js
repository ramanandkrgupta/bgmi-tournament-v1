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

        // Find user by email, mobile, or username
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { mobile: identifier },
                { username: identifier }
            ]
        });

        // If user not found or password does not match
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id }, 
            'YOUR_SECRET_KEY', // Use an environment variable for production
            { expiresIn: '1h' } // Token expiration (optional)
        );

        // Return token in the response (no session handling)
        res.status(200).json({ token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const secretKey = 'YOUR_SECRET_KEY';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ isAuthenticated: false, message: 'No token provided' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ isAuthenticated: false, message: 'Failed to authenticate token' });
      }
      req.userId = decoded.id;
      next();
    });
};
router.get('/check', verifyToken, (req, res) => {
    res.status(200).json({ isAuthenticated: true });
  });

module.exports = router;