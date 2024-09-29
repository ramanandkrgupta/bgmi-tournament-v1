const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');

// Middleware to authenticate user
router.use(authenticate);

// Utility function to get user ID from token
const getUserIdFromToken = (req) => {
    const token = req.headers.authorization.split(' ')[1]; // Assuming Bearer token
    const decodedToken = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace 'YOUR_SECRET_KEY' with your actual secret key
    return decodedToken.userId;
};

// Create a new team
router.post('/create', async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const { name } = req.body;
        const team = new Team({
            name,
            createdBy: userId,
            members: [userId]
        });
        await team.save();
        res.status(201).send('Team created successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Join a team
router.post('/join', async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const { teamId } = req.body;
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).send('Team not found');
        }
        if (team.members.includes(userId)) {
            return res.status(400).send('You are already a member of this team');
        }
        team.members.push(userId);
        await team.save();
        res.send('Joined team successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Fetch teams by user ID
router.get('/', async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const teams = await Team.find({
            $or: [
                { createdBy: userId },
                { members: userId }
            ]
        });
        res.send(teams);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;