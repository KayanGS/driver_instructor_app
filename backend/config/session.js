// filepath: backend/config/session.js
const session = require('express-session') // Import express-session;

// Import express-session
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
    resave: false, // Forces session to be saved back to the session store
    saveUninitialized: false,// Forces a session that is "uninitialized" to be saved to the store
    cookie: { // Cookie settings
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        maxAge: 1000 * 60 * 60 // Cookie expiration time (1 hour)
    }
});

module.exports = sessionMiddleware; // Export session middleware
