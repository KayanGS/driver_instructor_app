//filepath: //backend/routes/leson_routes.js
const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

//Create a new lesson
router.post('/create', async (req, res) => {
    // Try to create a new lesson
    try {
        // Get lessons details from request body
        const { user, lesson_date, lesson_time } = req.body;
        // Create a new lesson
        const new_lesson = new Lesson({ user, lesson_date, lesson_time });

        await new_lesson.save(); // Save the new lesson

        // Send a success response to the client
        res.status(200).json({
            message: 'Lesson created successfully',
            Lesson: new_lesson,
        });
        // If an error occurs, send an error response to the client
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all lessons
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
