const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const tournamentRoutes = require('./routes/tournament');
const transactionRoutes = require('./routes/transaction');

const app = express();

const cors = require('cors');


mongoose.connect('mongodb://localhost:27017/bgmi-tournament', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());
// Add CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Adjust the origin as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/auth', authRoutes);
app.use('/team', teamRoutes);
app.use('/tournament', tournamentRoutes);
app.use('/transaction', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));