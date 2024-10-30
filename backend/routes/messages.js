const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Message = require("../models/Message");

// Route to get friends of the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch the current user including friends
    const user = await User.findById(currentUserId)
      .populate("friends", "username")
      .lean();

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Fetch corresponding profiles
    const friendIds = user.friends.map((friend) => friend._id);
    const profiles = await Profile.find(
      { userId: { $in: friendIds } },
      "userId profilePicture"
    ).lean();

    // Map profiles to friends
    const friendsWithProfilePictures = user.friends.map((friend) => {
      const profile = profiles.find(
        (p) => p.userId.toString() === friend._id.toString()
      );
      return {
        ...friend,
        profilePicture: profile
          ? profile.profilePicture
          : "uploads/default-profile.png",
      };
    });

    // Send back the list of friends with their profile pictures and usernames
    res.status(200).json(friendsWithProfilePictures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get details of a specific friend
router.get("/:friendId", auth, async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUserId = req.user.id;

    // Check if the friendId is actually a friend of the current user
    const user = await User.findById(currentUserId)
      .populate("friends", "username")
      .lean();

    const isFriend = user.friends.some(
      (friend) => friend._id.toString() === friendId
    );
    if (!isFriend) {
      return res.status(404).json({ msg: "User not found or not a friend" });
    }

    // Fetch friend's profile details
    const profile = await Profile.findOne(
      { userId: friendId },
      "profilePicture"
    ).lean();
    const friendDetails = user.friends.find(
      (friend) => friend._id.toString() === friendId
    );

    res.status(200).json({
      ...friendDetails,
      profilePicture: profile
        ? profile.profilePicture
        : "uploads/default-profile.png",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { friendId, message, timestamp } = req.body;

    const newMessage = new Message({
      userId: req.user.id, // This will be fetched from the auth middleware
      friendId,
      message,
      timestamp,
    });

    const savedMessage = await newMessage.save();

    res.json(savedMessage);
  } catch (err) {
    console.error("Error saving message:", err.message);
    res.status(500).send("Server error");
  }
});

// In your messages route file
router.get("/conversation/:friendId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;

    // Fetch all messages between the current user and the friend
    const messages = await Message.find({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    }).sort({ timestamp: 1 }); // Sort messages by timestamp in ascending order

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
