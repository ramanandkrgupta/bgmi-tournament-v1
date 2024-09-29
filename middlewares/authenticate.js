const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send('Please authenticate');
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send('Please authenticate');
    }
};