// filepath: backend/config/session.js
const session = require('express-session') // Import express-session;

const sessionMiddleware = session({
    name: 'app_sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        maxAge: 1000 * 60 * 60 // Cookie expiration time (1 hour)
    }
});
module.exports = sessionMiddleware; // Export session middleware