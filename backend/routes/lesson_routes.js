const express = require('express');
const {
    createLesson,
    getLessonByID,
    updateLessonByID,
    deleteLessonByID
} = require('../controllers/LessonController');

const router = express.Router();

router.post('/lessons', createLesson);      // Users book lessons
router.get('/lessons/:id', getLessonByID);   // User fetches their lesson
router.put('/lessons/:id', updateLessonByID);    // Users reschedule or cancel
router.delete('/lessons/:id', deleteLessonByID); // Users delete lessons

module.exports = router;
