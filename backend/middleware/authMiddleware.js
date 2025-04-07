// backend/middleware/authMiddleware.js

exports.isAuthenticated = (req, res, next) => { // Middleware to check if user is authenticateds
    if (req.session && req.session.userId) { // Check if session exists and userId is present
        return next(); //###################### RETURN ########################
    } else {
        return res.status(401).json({ message: 'Unauthorized: Please login first' }); //###################### RETURN ########################  
    }
};
