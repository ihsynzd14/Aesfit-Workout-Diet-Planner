
// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../config/jwt');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;
      
      if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const user = new User({ email, firstName, lastName });
      const registeredUser = await User.register(user, password);
      
      const token = generateToken(registeredUser);
      res.status(201).json({ 
        user: { 
          id: registeredUser._id, 
          email: registeredUser.email, 
          firstName: registeredUser.firstName, 
          lastName: registeredUser.lastName 
        }, 
        token, 
        expiresIn: '1h' 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: 'Registration failed', details: error.message });
    }
  });
  
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const { user, error } = await User.authenticate()(email, password);
      
      if (error) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }
      
      const token = generateToken(user);
      res.json({ 
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }, 
        token, 
        expiresIn: '1h' 
      });
    } catch (error) {
      res.status(400).json({ error: 'Login failed', details: error.message });
    }
  });

module.exports = router;