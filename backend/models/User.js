const mongoose = require('mongoose');
const Profile = require('./Profile');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: 'default-profile.png' },
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Middleware to sync with Profile
UserSchema.pre('save', async function (next) {
  if (this.isModified('friends') || this.isModified('friendRequests')) {
    await Profile.findOneAndUpdate(
      { userId: this._id },
      { 
        friends: this.friends, 
        friendRequests: this.friendRequests 
      }
    );
  }
  next();
});

// Also handle `findOneAndUpdate` and `update`
UserSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await Profile.findOneAndUpdate(
      { userId: doc._id },
      { 
        friends: doc.friends, 
        friendRequests: doc.friendRequests 
      }
    );
  }
});

module.exports = mongoose.model('User', UserSchema);
