const express = require('express');
const requestLimiter = require('../middleware/requestLimiter');
const { isAuthenticated } = require('../middleware/authMiddleware');
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

// Secure these routes with isAuthenticated
router.post(
    '/lessons',
    requestLimiter,
    isAuthenticated,
    ...validateLessonForCreate,
    createLesson);

router.get('/lessons', requestLimiter, isAuthenticated, getAllLessons);
router.get('/lessons/:id', requestLimiter, isAuthenticated, getLessonByID);
router.put(
    '/lessons/:id',
    requestLimiter,
    isAuthenticated,
    ...validateLessonForUpdate,
    updateLessonByID
);

router.delete(
    '/lessons/:id',
    requestLimiter,
    isAuthenticated,
    deleteLessonByID
);

module.exports = router;
