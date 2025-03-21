//filepath: /controllers/LessonController.js

const Lesson = require('../models/Lesson'); // Importing the Lesson model
const User = require('../models/User'); // Importing the User model
const TimeSlot = require('../models/TimeSlot'); // Importing the TimeSlot model

/**
 * @desc Create a new lesson (Booking lesson using tokens)
 * @route POST /api/lessons
 * @access Private (Only authenticated users can book a lesson)
 * @param {*} req 
 * @param {*} res 
 * @returns 404 if user not found
 */
const createLesson = async (req, res) => {
    try {
        // Get the lesson_date and lesson_time from the request body
        const { lesson_date, lesson_time } = req.body;
        const user_id = req.user.id; // Get the user_id from the authenticated user
        const user = await User.findById(user_id); // Find the user by the user_id

        if (!user) { // If user not found
            return res.status(404).json({ message: 'User not found' }); //######## RETURN ########
        }

        if (user.user_tokens <= 0) { // Check if user has enough tokens
            return res.status(400).json({ message: 'Insufficient tokens' }); //######## RETURN ########
        }

        // Check if the time slot is available
        const time_slot = await TimeSlot.findOneAndDelete({
            date: lesson_date,
            time: lesson_time
        });

        if (!time_slot) { // If time slot not available
            res.status(400).json({ message: 'Time slot not available' }); //######## RETURN ########
        }

        // Create a new lesson
        const new_lesson = new Lesson({
            user: user_id,
            date: lesson_date,
            time: lesson_time,
        });

        await new_lesson.save(); // Save the new lesson to the database

        user.user_tokens -= 1; // Deduct one token from the user
        await user.save(); // Save the updated user to the database

        // Mark time slot as booked
        time_slot.is_available = false; // Set is_available to false
        time_slot.booked_by = user_id; // Set booked_by to user_id
        await time_slot.save(); // Save the updated time slot to the database

        res.status(201).json({ message: 'Lesson booked successfully' }); //######## RETURN ########

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); //######## RETURN ########
    }
}

/**
 * @desc Get lesson by ID
 * @route GET /api/lessons/:id
 * @access Private (Only authenticated users can get a lesson)
 * @param {*} req
 * @param {*} res
 * @returns 404 if lesson not found
 */
const getLessonByID = async (req, res) => {
    try {
        // Find lesson by ID and populate the user field
        const lesson = await Lesson.findById(req.params.id).
            populate('user', 'user_name user_email');

        if (!lesson) { // If lesson not found
            return res.status(404).json({ message: 'Lesson not found' }); //######## RETURN ########
        }



    } catch (error) {

    }
}

