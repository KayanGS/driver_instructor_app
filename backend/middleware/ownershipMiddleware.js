// filepath: backend/middleware/ownershipMiddleware.js

const Lesson = require('../models/Lesson');
const User = require('../models/User');

// Check if the session belongs to the user or an admin
function isOwnerOrAdminSession(req, resourceUserId) {
    return (
        req.session.userId === resourceUserId.toString() ||
        req.session.userRole === 'admin'
    );
}

// Middleware to check if user is owner of a User resource or an admin
exports.isUserOwnerOrAdmin = async (req, res, next) => {
    try {
        const userIdParam = req.params.id;
        const user = await User.findById(userIdParam);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!isOwnerOrAdminSession(req, user._id)) {
            return res.status(403).json({ message: 'Unauthorized access to user resource' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Middleware to check if user is owner of a Lesson resource or an admin
exports.isLessonOwnerOrAdmin = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('user');
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        if (!isOwnerOrAdminSession(req, lesson.user._id)) {
            return res.status(403).json({ message: 'Unauthorized access to lesson' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Middleware to filter lessons only for the user or admin
exports.filterLessonsByOwnership = async (req, res, next) => {
    try {
        const isAdmin = req.session.userRole === 'admin';

        const lessons = await Lesson.find()
            .populate('user', 'user_name user_email')
            .select('lesson_date lesson_time lesson_status user');

        const filtered = isAdmin
            ? lessons
            : lessons.filter(
                lesson =>
                    lesson.user && lesson.user._id && lesson.user._id.toString() === req.session.userId
            );

        req.filteredLessons = filtered;
        next();
    } catch (err) {
        console.error('❌ Error in filterLessonsByOwnership:', err);
        res.status(500).json({ message: 'Error filtering lessons', error: err.message });
    }
};
