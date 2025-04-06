//filepath: //backend/routes/user_routes.js
const express = require('express'); // Import express
const { validateUser } = require('../validation/userValidation');

const router = express.Router(); // Create a router
// Import the user controller
const { createUser,
    getAllUsers,
    getUserByID,
    updateUserByID,
    deleteUserByID,
    buyTokens,
    loginUser,
    logoutUser } =
    require('../controllers/UserController');

const { registerUser } = require('../controllers/RegistrationController');

router.post('/register', registerUser); // Register a new user
router.post('/users', validateUser, createUser); // Create a new user
router.get('/users', getAllUsers); // Get all users
router.get('/users/:id', getUserByID); // Get a user by ID
router.put('/users/:id', validateUser, updateUserByID); // Update a user by ID
router.delete('/users/:id', deleteUserByID); // Delete a user by ID
router.post('/users/:id/buy', buyTokens); // Buy tokens for a user
router.post('/login', loginUser); // Login a user
router.post('/logout', logoutUser); // Logout a user

module.exports = router; // Export the router