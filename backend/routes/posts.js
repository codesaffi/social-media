const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User'); 
const router = express.Router();

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

// @route POST api/posts
// @desc Create a post
// @access Private
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.user.id,
      image: req.file.path,
      caption: req.body.caption,
    });

    const post = await newPost.save();

    // Update user's profile with the new post
    await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { posts: post._id } }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



router.post('/birthday', [auth, upload.single('image')], async (req, res) => {
  try {
    const { friendId, caption } = req.body;

    // Fetch the current user's details (including username)
    const currentUser = await User.findById(req.user.id);
    // Fetch the friend's details (including username)
    const friendUser = await User.findById(friendId);

    if (!currentUser || !friendUser) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const newPost = new Post({
      userId: req.user.id,
      image: req.file.path,
      caption: `${currentUser.username} is with ${friendUser.username}! ${caption}`,  // Correctly tag friend
      type: 'birthday',  // Tag post as a birthday type
    });

    const post = await newPost.save();

    // Optionally update user's profile with the new post
    await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { posts: post._id } }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/posts
// @desc Get all posts for a user
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.json(post); // Return the updated post
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route PUT api/posts/unlike/:id
// @desc Unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has not been liked yet
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Remove the like
    post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/comment/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.user', ['username']);
    const user = await User.findById(req.user.id).select('-password');

    const newComment = {
      user: req.user.id,
      text: req.body.text,
    };

    post.comments.unshift(newComment);

    await post.save();

    // Re-fetch the post to include the populated comments
    const updatedPost = await Post.findById(req.params.id).populate('comments.user', ['username']);

    res.json(updatedPost.comments);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/posts/comments/:id
// @desc Get all comments for a post
// @access Private
router.get('/comments/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.user', ['username']);

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/share/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been shared
    if (post.shares.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Post already shared' });
    }

    post.shares.push(req.user.id);
    await post.save();

    res.json(post.shares);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
