// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware to verify the token
const User = require('../models/User'); // Your User model

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
      // Find the user by ID and return the user data
      const user = await User.findById(req.user.id).select('-password'); // Exclude the password
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
