const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Public
 * @param {*} req 
 * @param {*} res 
 */
exports.createUser = async (req, res) => {

    try {
        // Destructure user_name, user_email, user_password from req.body
        const { user_name, user_email, user_password } = req.body;
        // Hash the user_password using bcrypt
        const hashed_password = await bcrypt.hash(user_password, 10);
        // Create a new user
        const new_user = new User({
            user_name,
            user_email,
            user_password: hashed_password,
        });

        await new_user.save(); // Save the new user to the database
        // Send a response to the client
        res.status(201).json({
            message: 'User created successfully',
            new_user,
        });

    } catch (error) { // Catch any errors
        res.status(400).json({ error: error.message });
    }
};

/**
 * @desc Get user by ID
 * @route GET /api/users
 * @access Private
 * @param {*} req 
 * @param {*} res 
 * @returns  404 if user not found
 */
exports.getUserByID = async (req, res) => {
    try {
        // Find user by ID and populate the lessons field
        const user = await User.findById(req.params.id).populate('lessons');
        if (!user) { // If user not found
            return res.status(404).json({ message: 'User not found' }); // ######### RETURN ##########
        };
        res.json(user); // Send user to the client

    } catch (error) { // Catch any errors
        res.status(400).json({ error: error.message });
    }
};

/**
 * @desc Update users by ID
 * @route PUT /api/users
 * @access Private
 * @param {*} req 
 * @param {*} res 
 * @returns 404 if user not found
 */
exports.updateUserByID = async (req, res) => {
    try {
        if (req.body.user_password) { // If user_password is provided
            // Hash the user_password using bcrypt
            req.body.user_password =
                await bcrypt.hash(req.body.user_password, 10);
        };
        // Find user by ID and update the user
        const updated_user = await
            User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updated_user) { // If user not found
            return res.status(404).json({ message: 'User not found' }); // ######### RETURN ##########
        }
        // Send a response to the client        
        res.json({ message: 'User updated successfully', updated_user });

    } catch (error) { // Catch any errors
        res.status(400).json(error.message);
    }
};

/**
 * @desc Delete user by ID
 * @route DELETE /api/users
 * @access Private
 * @param {*} req 
 * @param {*} res 
 * @returns 404 if user not found
 */
exports.deleteUserByID = async (req, res) => {
    try {
        // Find user by ID and delete the user
        const deleted_user = await User.findByIdAndDelete(req.params.id);
        if (!deleted_user) { // If user not found
            return res.status(404).json({ // ######### RETURN ##########
                message: 'User not found'
            });
        }
        // Send a response to the client
        res.json({ message: 'User delted successfully', deleted_user });

    } catch (error) { // Catch any errors
        res.status(400).json({ error: error.message });
    }

} 
