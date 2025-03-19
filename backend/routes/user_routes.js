const express = require('express');
const router = express.Router();
const user = require('../models/User');

//Create a new user
router.post('/register', async (req, res) => {

    try {
        const { user_name, user_email, user_password } = req.body;
        const new_user = new user({ user_name, user_email, user_password });
    } catch (error) {

    }

})