const express = require('express');
const { validateLesson } = require('../validation/lessonValidation');
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
router.post('/lessons', isAuthenticated, ...validateLesson, createLesson);
router.get('/lessons', isAuthenticated, getAllLessons);
router.get('/lessons/:id', isAuthenticated, getLessonByID);
router.put('/lessons/:id', isAuthenticated, ...validateLesson, updateLessonByID);
router.delete('/lessons/:id', isAuthenticated, deleteLessonByID);

module.exports = router;
