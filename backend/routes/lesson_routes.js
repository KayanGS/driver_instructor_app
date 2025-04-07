const express = require('express');
const {
    validateLessonForCreate,
    validateLessonForUpdate } = require('../validation/lessonValidation');
const { isAuthenticated } = require('../middleware/authMiddleware');

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
    isAuthenticated,
    ...validateLessonForCreate,
    createLesson);

router.get('/lessons', isAuthenticated, getAllLessons);
router.get('/lessons/:id', isAuthenticated, getLessonByID);
router.put(
    '/lessons/:id',
    isAuthenticated,
    ...validateLessonForUpdate,
    updateLessonByID);

router.delete('/lessons/:id', isAuthenticated, deleteLessonByID);

module.exports = router;
