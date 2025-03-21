//filepath: //backend/routes/user_routes.js
const express = require('express'); // Import express
const router = express.Router(); // Create a router
// Import the user controller
const { createUser, getUserByID, updateUserByID, deleteUserByID } =
    require('../controllers/UserController');

router.post('/users', createUser); // Create a new user
router.get('/users/:id', getUserByID); // Get a user by ID
router.put('/users/:id', updateUserByID); // Update a user by ID
router.delete('/users/:id', deleteUserByID); // Delete a user by ID

module.exports = router; // Export the router