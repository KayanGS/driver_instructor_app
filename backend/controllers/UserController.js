const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {

    try {
        const { user_name, user_email, user_password } = req.body;
        const hashed_password = await bcrypt.hash(user_password, 10);
        const new_user = new User({
            user_name,
            user_email,
            user_password: hashed_password,
        });

        await new_user.save();
        res.status(201).json({
            message: 'User created successfully',
            new_user,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get user by ID 
exports.getUserByID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('lessons');
        if (!user) {
            return res.status(404).json({ message: 'User not fout' });
            res.json(user);
        };
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update user by ID
exports.updateUserByID = async (req, res) => {
    try {
        if (req.body.user_password) {
            req.body.user_password = await bcrypt.hash(req.body.user_passworc, 10);
        };
    } catch (error) {

    }
};
