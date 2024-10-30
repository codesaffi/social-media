// Profile routes
const express = require('express');
const multer = require('multer');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const router = express.Router();
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// @route GET api/profile
// @desc Get current user's profile
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', [auth, upload.fields([{ name: 'profilePicture' }, { name: 'coverPicture' }])], async (req, res) => {
  const {
    username,
    dob,
    phoneNumber,
    nickname,
    sex,
    bio,
  } = req.body;

  // Build profile object
  const profileFields = {
    userId: req.user.id,
    username,
    dob,
    phoneNumber,
    nickname,
    sex,
    bio,
    profilePicture: req.files['profilePicture'] ? req.files['profilePicture'][0].path : undefined,
    coverPicture: req.files['coverPicture'] ? req.files['coverPicture'][0].path : undefined,
  };

  try {
    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      // Update profile
      profile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error('Error saving profile:', err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
