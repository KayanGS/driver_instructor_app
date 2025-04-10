// filepath: backend/routes/user_routes.js

const express = require('express');
const { validateUser } = require('../validation/userValidation');
const requestLimiter = require('../middleware/requestLimiter');

const { isAuthenticated } = require('../middleware/authMiddleware');

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
router.post('/logout', requestLimiter, isAuthenticated, logoutUser); // Logout a user
//router.post('/users', requestLimiter, validateUser, createUser); // Admin Create User
router.get('/users', requestLimiter, isAuthenticated, getAllUsers); // Get all users
router.get('/users/:id', requestLimiter, isAuthenticated, getUserByID); // Get user by ID
router.put('/users/:id', requestLimiter, isAuthenticated, validateUser, updateUserByID); // Update user
router.delete('/users/:id', requestLimiter, isAuthenticated, deleteUserByID); // Delete user
router.post('/users/:id/buy', requestLimiter, isAuthenticated, buyTokens); // Buy tokens

module.exports = router;
