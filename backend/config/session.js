const session = require('express-session');

const sessionMiddleware = session({
    secret: 'your_session_secret_here', // Replace with a secure secret or use process.env.SECRET
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
});

module.exports = sessionMiddleware;
