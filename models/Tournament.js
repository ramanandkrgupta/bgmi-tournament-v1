const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    teamName: { type: String, required: true },
    kills: { type: Number, default: 0 },
    placePoints: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 }
});

const TournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    entryFee: { type: Number, required: true },
    prize: { type: Number, required: true },
    teams: [TeamSchema], // Use the new TeamSchema for teams
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    bannerImage: { type: String, required: true },
    map: { type: String, enum: ['ERANGEL', 'LIVIK', 'MIRAMAR'], required: true },
    mode: { type: String, enum: ['SQUAD', 'DUO', 'SOLO'], required: true },
    perKill: { type: Number, required: true },
    maxTeamJoin: { type: Number, required: true },
    hostName: { type: String, required: true },
    hostLink: { type: String, required: true }
});

// Function to set maxTeamJoin based on map
TournamentSchema.pre('validate', function(next) {
    const mapMaxTeams = {
        'ERANGEL': 25,
        'LIVIK': 13,
        'MIRAMAR': 25
    };

    if (this.map && mapMaxTeams[this.map]) {
        this.maxTeamJoin = mapMaxTeams[this.map];
    }

    next();
});

module.exports = mongoose.model('Tournament', TournamentSchema);
