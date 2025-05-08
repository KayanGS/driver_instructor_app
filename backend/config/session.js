// filepath: backend/config/session.js
/**
 * @file session.js
 * @requires express-session
 * @exports sessionMiddleware
 * @description Configures session middleware for Express.js
 */

// ############################### IMPORTS ####################################
const session = require('express-session') // Import express-session;
// ############################## END IMPORTS #################################

const sessionMiddleware = session({
    name: 'app_sid', // Name of the session ID cookie
    secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
    resave: false, // Do not save session if unmodified 
    saveUninitialized: false, // Do not create session until something stored
    rolling: true, // Reset cookie expiration on every response
    cookie: {
        secure: process.env.NODE_ENV === 'production',// Use secure cookies in production
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 // Cookie expiration time (1 hour)
    }
});
module.exports = sessionMiddleware; // Export session middleware
