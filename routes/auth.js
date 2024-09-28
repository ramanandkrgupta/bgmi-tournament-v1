const express = require('express');
   const router = express.Router();
   const User = require('../models/User');
   const jwt = require('jsonwebtoken');

   router.post('/register', async (req, res) => {
       try {
           const { username, email, password } = req.body;
           const user = new User({ username, email, password });
           await user.save();
           res.status(201).send('User registered successfully');
       } catch (error) {
           res.status(400).send(error.message);
       }
   });

   router.post('/login', async (req, res) => {
       try {
           const { email, password } = req.body;
           const user = await User.findOne({ email });
           if (!user || !(await user.comparePassword(password))) {
               return res.status(400).send('Invalid credentials');
           }
           const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY');
           res.send({ token });
       } catch (error) {
           res.status(400).send(error.message);
       }
   });

   module.exports = router;