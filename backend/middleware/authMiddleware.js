// backend/middleware/authMiddleware.js
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized: Please login first' });
    }
};
