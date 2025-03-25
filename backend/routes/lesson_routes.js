const express = require('express');
const { validateLesson } = require('../validation/lessonValidation');

const {
    createLesson,
    getAllLessons,
    getLessonByID,
    updateLessonByID,
    deleteLessonByID
} = require('../controllers/LessonController');

const router = express.Router();

router.post('/lessons', ...validateLesson, createLesson); // Users book lessons
router.get('/lessons', getAllLessons); // Get all lessons
router.get('/lessons/:id', getLessonByID);   // User fetches their lesson
router.put('/lessons/:id', ...validateLesson, updateLessonByID); // Users reschedule 
router.delete('/lessons/:id', deleteLessonByID); // Users delete lessons

module.exports = router;
