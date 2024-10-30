const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth'); 
const Post = require('../models/Post'); 

const router = express.Router();

async function syncProfile(userId, updateFields) {
  try {
    await Profile.findOneAndUpdate(
      { userId: userId },
      { $set: updateFields },
      { new: true }
    );
  } catch (err) {
    console.error('Error syncing profile:', err.message);
  }
}

// Route to get all users except the logged-in user, friends, and users who have sent friend requests
router.get('/', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch the current user including friends and received friend requests
    const currentUser = await User.findById(currentUserId)
      .select('friends friendRequests')
      .lean();

    // Fetch all users except the current user, their friends, and those who sent friend requests
    const users = await User.find({
      _id: { 
        $ne: currentUserId, 
        $nin: [...currentUser.friends, ...currentUser.friendRequests] 
      }
    }, 'username').lean();

    const userIds = users.map(user => user._id);

    // Fetch corresponding profiles
    const profiles = await Profile.find({ userId: { $in: userIds } }, 'userId profilePicture').lean();

    // Map profiles to users
    const usersWithProfilePictures = users.map(user => {
      const profile = profiles.find(p => p.userId.toString() === user._id.toString());
      return {
        ...user,
        profilePicture: profile ? profile.profilePicture : 'uploads/default-profile.png',
      };
    });

    res.status(200).json(usersWithProfilePictures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/profile/:id/posts', auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch the user's profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ userId });
    const posts = await Post.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePicture: profile ? profile.profilePicture : 'uploads/default-profile.png',
      coverPicture: profile ? profile.coverPicture : 'uploads/default-profile.png',
      dob: profile ? profile.dob : null,
      phoneNumber: profile ? profile.phoneNumber : null,
      nickname: profile ? profile.nickname : null,
      sex: profile ? profile.sex : null,
      bio: profile ? profile.bio : null,
      posts,  // Ensure posts are correctly attached to the response
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile and posts' });
  }
});

router.get('/profile/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch the user's profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ userId });
    const posts = await Post.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePicture: profile ? profile.profilePicture : 'uploads/default-profile.png',
      dob: profile ? profile.dob : null,
      phoneNumber: profile ? profile.phoneNumber : null,
      nickname: profile ? profile.nickname : null,
      sex: profile ? profile.sex : null,
      bio: profile ? profile.bio : null,
      posts,  // Ensure posts are correctly attached to the response
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile and posts' });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      console.log('User not found'); // Debug log
      return res.status(400).json({ msg: 'Invalid Credentials' });
    } else {
      console.log('User found:', user); // Debug log
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    console.log('Password match:', isMatch); // Debug log
    console.log('JWT Secret:', process.env.JWT_SECRET);

    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };
    console.log(payload);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        console.log('Token generated:', token); // Log the token
        res.json({ token, user: { username: user.username } });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error');
  }
});

// Route to fetch all posts from friends
router.get('/home/posts', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch the current user with friends
    const currentUser = await User.findById(currentUserId).select('friends').lean();

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all posts from friends
    const friendPosts = await Post.find({ userId: { $in: currentUser.friends } })
      .populate('userId', 'username') // Populate the user's username
      .sort({ date: -1 }); // Sort posts by date, most recent first

    res.status(200).json(friendPosts);
  } catch (err) {
    console.error('Error fetching friends\' posts:', err.message);
    res.status(500).json({ message: 'Error fetching friends\' posts' });
  }
});

module.exports = router;
