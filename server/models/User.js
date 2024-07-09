const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
