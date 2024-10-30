const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Notification = require('../models/Notifications'); // Assuming you have a Notification model

const router = express.Router();

// Send Friend Request
router.post('/request', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.friendRequests.includes(targetUserId)) {
      return res.status(400).json({ msg: 'Request already sent' });
    }

    targetUser.friendRequests.push(user.id);
    await targetUser.save();

    // Create a notification
    const notification = new Notification({
      userId: targetUserId,
      message: 'You have a new friend request.'
    });
    await notification.save();

    res.status(200).json({ msg: 'Friend request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Cancel Friend Request
router.post('/cancel', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const user = await User.findById(req.user.id);

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    targetUser.friendRequests = targetUser.friendRequests.filter(
      id => id.toString() !== user.id.toString()
    );
    await targetUser.save();

    res.status(200).json({ msg: 'Friend request canceled' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get Friend Requests
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friendRequests', 'username').lean();

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const requesterIds = user.friendRequests.map(request => request._id);
    const profiles = await Profile.find({ userId: { $in: requesterIds } }, 'userId profilePicture').lean();

    const friendRequestsWithProfilePictures = user.friendRequests.map(request => {
      const profile = profiles.find(p => p.userId.toString() === request._id.toString());
      return {
        ...request,
        profilePicture: profile ? profile.profilePicture : 'uploads/default-profile.png',
      };
    });

    res.status(200).json(friendRequestsWithProfilePictures);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Accept Friend Request
router.post('/accept', auth, async (req, res) => {
  try {
    const { requesterId } = req.body;
    const user = await User.findById(req.user.id);
    const requester = await User.findById(requesterId);

    if (!requester) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Add each other to friends list
    user.friends.push(requesterId);
    requester.friends.push(user.id);

    // Remove the request from the user's friendRequests
    user.friendRequests = user.friendRequests.filter(
      id => id.toString() !== requesterId.toString()
    );

    await user.save();
    await requester.save();

    res.status(200).json({ msg: 'Friend request accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete Friend Request
router.post('/delete', auth, async (req, res) => {
  try {
    const { requesterId } = req.body;
    const user = await User.findById(req.user.id);

    user.friendRequests = user.friendRequests.filter(
      id => id.toString() !== requesterId.toString()
    );

    await user.save();

    res.status(200).json({ msg: 'Friend request deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to get friends of the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch the current user including friends
    const user = await User.findById(currentUserId)
      .populate('friends', 'username')
      .lean();

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch corresponding profiles
    const friendIds = user.friends.map(friend => friend._id);
    const profiles = await Profile.find({ userId: { $in: friendIds } }, 'userId profilePicture').lean();

    // Map profiles to friends
    const friendsWithProfilePictures = user.friends.map(friend => {
      const profile = profiles.find(p => p.userId.toString() === friend._id.toString());
      return {
        ...friend,
        profilePicture: profile ? profile.profilePicture : 'uploads/default-profile.png',
      };
    });

    // Send back the list of friends with their profile pictures and usernames
    res.status(200).json(friendsWithProfilePictures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});






// Route to get the birthdays of friends of the logged-in user
router.get('/birthdays', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch the current user including friends
    const user = await User.findById(currentUserId)
      .populate('friends', 'username')
      .lean();

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch profiles of friends including date of birth (dob)
    const friendIds = user.friends.map(friend => friend._id);
    const profiles = await Profile.find({ userId: { $in: friendIds } }, 'userId profilePicture dob').lean();

    // Map profiles to friends with profile picture, username, dob, and id
    const friendsWithBirthdays = user.friends.map(friend => {
      const profile = profiles.find(p => p.userId.toString() === friend._id.toString());
      return {
        friendId: friend._id, // Send the friend ID as well
        username: friend.username,
        profilePicture: profile ? profile.profilePicture : 'uploads/default-profile.png',
        dob: profile ? profile.dob : null
      };
    });

    // Send back the list of friends with their IDs, profile pictures, usernames, and dob
    res.status(200).json(friendsWithBirthdays);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
