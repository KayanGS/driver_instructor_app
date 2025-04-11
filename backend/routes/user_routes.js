// filepath: backend/routes/user_routes.js

const express = require('express');
const { validateUser } = require('../validation/userValidation');
const requestLimiter = require('../middleware/requestLimiter');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { isUserOwnerOrAdmin } = require('../middleware/ownershipMiddleware');

const {
    registerUser,
    getAllUsers,
    getUserByID,
    updateUserByID,
    deleteUserByID,
    buyTokens,
    loginUser,
    logoutUser
} = require('../controllers/UserController');

const router = express.Router();

// Public Routes
router.post('/register', requestLimiter, registerUser); // Register a new user
router.post('/login', requestLimiter, loginUser); // Login a user

// Protected Routes
router.post('/logout', requestLimiter, logoutUser); // Logout a user
router.delete(
    '/users/:id',
    isUserOwnerOrAdmin,
    requestLimiter,
    isAuthenticated,
    deleteUserByID
); // Delete user

router.post( // Buy tokens
    '/users/:id/buy',
    requestLimiter,
    isUserOwnerOrAdmin,
    isAuthenticated,
    buyTokens);

router.put( // Update user
    '/users/:id',
    requestLimiter,
    isUserOwnerOrAdmin,
    isAuthenticated,
    validateUser,
    updateUserByID
);

//Private Routes
router.get('/users', isAdmin, requestLimiter, isAuthenticated, getAllUsers); // Get all users
router.get('/users/:id', isAdmin, requestLimiter, isAuthenticated, getUserByID); // Get user by ID

module.exports = router;
