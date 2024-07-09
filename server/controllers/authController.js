const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { clerkUserId, email, name } = req.body;
    const user = new User({ clerkUserId, email, name });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
