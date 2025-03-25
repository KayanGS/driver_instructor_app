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
    buyTokens } =
    require('../controllers/UserController');

router.post('/users', validateUser, createUser); // Create a new user
router.get('/users', getAllUsers); // Get all users
router.get('/users/:id', getUserByID); // Get a user by ID
router.put('/users/:id', validateUser, updateUserByID); // Update a user by ID
router.delete('/users/:id', deleteUserByID); // Delete a user by ID
router.post('/users/:id/buy', buyTokens);

module.exports = router; // Export the router