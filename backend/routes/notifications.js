const express = require('express');
const Notification = require('../models/Notifications');
const auth = require('../middleware/auth'); // Ensure user is authenticated
const router = express.Router();

// @route POST api/notifications
// @desc Add a new notification
// @access Private
router.post('/', auth, async (req, res) => {
  const { message } = req.body;

  try {
    const newNotification = new Notification({
      userId: req.user.id,
      message,
      readStatus: false, // New notifications are initially unread
    });

    const notification = await newNotification.save();
    res.json(notification);
  } catch (err) {
    console.error('Error creating notification:', err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/notifications
// @desc Get notifications for the current user and mark them as read
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    // Fetch notifications
    const notifications = await Notification.find({ userId: req.user.id }).sort({ date: -1 });

    // Mark all unread notifications as read
    await Notification.updateMany({ userId: req.user.id, readStatus: false }, { $set: { readStatus: true } });

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/notifications/unread-count
// @desc Get the count of unread notifications for the current user
// @access Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ userId: req.user.id, readStatus: false });
    res.json({ unreadCount });
  } catch (err) {
    console.error('Error fetching unread notifications count:', err.message);
    res.status(500).send('Server error');
  }
});

// @route PUT api/notifications/:id
// @desc Mark a notification as read
// @access Private
router.put('/:id', auth, async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    notification.readStatus = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error('Error updating notification:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

