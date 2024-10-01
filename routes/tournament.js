const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const authenticate = require('../middlewares/authenticate');
const checkUserBalance = require('../utils/checkUserBalance');


// Middleware to authenticate user
router.use(authenticate);

// Utility function to get user ID from token
const getUserIdFromToken = (req) => {
    const token = req.headers.authorization.split(' ')[1]; // Assuming Bearer token
    const decodedToken = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace 'YOUR_SECRET_KEY' with your actual secret key
    return decodedToken.userId;
};

// Create a new tournament
// List tournament matches by status
router.get('/matches', async (req, res) => {
    try {
        const upcomingMatches = await Tournament.find({ status: 'upcoming' });
        const ongoingMatches = await Tournament.find({ status: 'ongoing' });
        const completedMatches = await Tournament.find({ status: 'completed' });

        res.json({
            upcoming: upcomingMatches,
            ongoing: ongoingMatches,
            completed: completedMatches
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get match details by ID
router.get('/matches/:id', async (req, res) => {
    try {
        const matchId = req.params.id;
      const match = await Tournament.findById(matchId);
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get teams that joined a match by match ID
  router.get('/matches/:id/teams', async (req, res) => {
    try {
      const teams = await Tournament.find({ matchId: req.params.id });
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Join a match by ID
router.post('/matches/:id/join', async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const { teamId } = req.body;
        const userId = getUserIdFromToken(req);
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Calculate the amount to be deducted from each wallet
        let entryFee = tournament.entryFee;
        let bonusFee = entryFee * 0.02;
        entryFee -= bonusFee;

        if (user.bonusWallet >= bonusFee) {
            user.bonusWallet -= bonusFee;
        } else {
            bonusFee = user.bonusWallet;
            user.bonusWallet = 0;
        }

        if (user.depositWallet >= entryFee) {
            user.depositWallet -= entryFee;
        } else {
            const remainingFee = entryFee - user.depositWallet;
            user.depositWallet = 0;
            if (user.winningsWallet >= remainingFee) {
                user.winningsWallet -= remainingFee;
            } else {
                return res.status(400).send('Insufficient balance to join the tournament');
            }
        }

        await user.save();
        tournament.teams.push(teamId);
        await tournament.save();
        res.send('Team joined tournament successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});


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
        if (!tournamentId || !teamId) {
            return res.status(400).send('Tournament ID and Team ID are required');
        }
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