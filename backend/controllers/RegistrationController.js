//filepath: backend/controllers/UserController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');


exports.registerUser = async (req, res) => {

  try { // Check if the request is a POST request
    console.log('➡️ registerUser controller hit');
    const { user_name, user_email, user_password } = req.body; // Extracting user data from the request body
    console.log('📥 Data received:', { user_name, user_email });

    // Basic check
    if (!user_name || !user_email || !user_password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Normalize Emails
    const normalizedEmail = user_email.toLowerCase();
    // Check if email is already in use
    const existingUser = await User.findOne({ user_email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10); // Hash the password

    const newUser = new User({
      user_name,
      user_email: normalizedEmail,
      user_password: hashedPassword,
      user_role: 'user', // Force user role on registration
    });

    await newUser.save();

    res.status(201).json({

      message: 'Registration successful',
      user: {
        _id: newUser._id,
        user_name: newUser.user_name,
        user_email: newUser.user_email,
        user_role: newUser.user_role
      }

    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
};