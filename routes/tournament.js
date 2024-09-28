const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const authenticate = require('../middlewares/authenticate');

// Middleware to authenticate user
router.use(authenticate);

// Create a new tournament
router.post('/create', async (req, res) => {
    try {
        const { name, entryFee, prize, startDate, endDate } = req.body;
        const tournament = new Tournament({
            name,
            entryFee,
            prize,
            createdBy: req.user.id,
            startDate,
            endDate
        });
        await tournament.save();
        res.status(201).send('Tournament created successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Join a tournament
router.post('/join', async (req, res) => {
    try {
        const { tournamentId, teamId } = req.body;
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).send('Tournament not found');
        }
        if (tournament.status !== 'upcoming') {
            return res.status(400).send('Cannot join an ongoing or completed tournament');
        }
        if (tournament.teams.includes(teamId)) {
            return res.status(400).send('Team already joined this tournament');
        }
        tournament.teams.push(teamId);
        await tournament.save();
        res.send('Team joined tournament successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;