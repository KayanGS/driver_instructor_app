//filepath: backend/middleware/requestLimiter.js
const rateLimit = require('express-rate-limit');

const requestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // limit each IP to 10 requests per windowMs
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
    message: 'Too many requests from this IP, please try again later.'
});
module.exports = requestLimiter;
