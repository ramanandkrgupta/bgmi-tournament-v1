const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');

// Middleware to authenticate user
router.use(authenticate);

// Create a new team
router.post('/create', async (req, res) => {
    try {
        const { name } = req.body;
        const team = new Team({
            name,
            createdBy: req.user.id,
            members: [req.user.id]
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
        const { teamId } = req.body;
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).send('Team not found');
        }
        if (team.members.includes(req.user.id)) {
            return res.status(400).send('You are already a member of this team');
        }
        team.members.push(req.user.id);
        await team.save();
        res.send('Joined team successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;