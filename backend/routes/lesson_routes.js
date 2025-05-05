const express = require('express');
const requestLimiter = require('../middleware/requestLimiter');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { isLessonOwnerOrAdmin, filterLessonsByOwnership } = require('../middleware/ownershipMiddleware');

const {
    validateLessonForCreate,
    validateLessonForUpdate } = require('../validation/lessonValidation');

const {
    createLesson,
    getAllLessons,
    getLessonByID,
    updateLessonByID,
    deleteLessonByID
} = require('../controllers/LessonController');

const router = express.Router();

// Protected Routes
router.post(
    '/lessons',
    requestLimiter,
    // isAuthenticated,
    validateLessonForCreate,
    createLesson);

router.get(
    '/lessons',
    requestLimiter,
    isAuthenticated,
    filterLessonsByOwnership,
    getAllLessons);

router.put(
    '/lessons/:id',
    requestLimiter,
    isLessonOwnerOrAdmin,
    isAuthenticated,
    validateLessonForUpdate,
    updateLessonByID
);

router.delete(
    '/lessons/:id',
    isLessonOwnerOrAdmin,
    requestLimiter,
    isAuthenticated,
    deleteLessonByID
);

// Private Routes
router.get(
    '/lessons/:id',
    isAdmin,
    requestLimiter,
    isAuthenticated,
    getLessonByID);
module.exports = router;
