const viewLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
    message: 'Too many requests from this IP, please try again later.'
});
