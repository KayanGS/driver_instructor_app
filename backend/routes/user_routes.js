//filepath: //backend/routes/user_routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

//Create a new user
router.post('/register', async (req, res) => {

    try {
        const { user_name, user_email, user_password } = req.body;
        const new_user = new User({ user_name, user_email, user_password });
        await new_user.save();

        res.status(200).json({
            message: 'User created successfully', user: new_user
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;