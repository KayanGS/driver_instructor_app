const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Public
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
 * @desc Get all users
 * @route GET /api/users
 * @access Private  
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users
        const users = await User.find()
            .populate('lessons', 'lesson_date lesson_time lesson_status')
            .select('user_name user_email');

        // Send users to the client
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: 'Server error while fetching users',
            error: error.message
        });
    }
}

/**
 * @desc Get user by ID
 * @route GET /api/users
 * @access Private
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
        res.json({ message: 'User deleted successfully', deleted_user });

    } catch (error) { // Catch any errors
        res.status(400).json({ error: error.message });
    }
}

/**
 * @desc Add tokens to a user
 * @route POST /api/users/:id/buy
 * @access Public
 */
exports.buyTokens = async (req, res) => {
    try {
        const { package } = req.body; // Get package type from request body
        const userId = req.params.id; // Get user ID from request params

        const user = await User.findById(userId); // Find user by ID

        if (!user) { // If user not found
            return res.status(404).json({ message: 'User not found' }); // ######### RETURN ##########
        }

        let tokens = 0; // Initialize tokens to 0
        if (package === 'individual') tokens = 1; // Set 1 token for individual package
        else if (package === 'sixpack') tokens = 6; // Set 6 tokens for sixpack package
        else if (package === 'twelvepack') tokens = 12; // Set 12 tokens for twelvepack package

        else { // If invalid package type
            return res.status(400).json({ message: 'Invalid package type' }); // ######### RETURN ##########
        }

        user.user_tokens += tokens; // Add tokens to user
        await user.save(); // Save user to the database

        res.status(200).json({// Send a response to the client
            message: `Successfully added ${tokens} token(s)`,
            current_tokens: user.user_tokens
        });

    } catch (error) { // Catch any errors
        console.error('Token purchase error:', error);
        res.status(500).json({
            message: 'Server error while processing token purchase',
            error: error.message
        });
    }
};


