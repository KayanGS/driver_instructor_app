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
exports.createLesson = async (req, res) => {
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
exports.getLessonByID = async (req, res) => {
    try {
        // Find lesson by ID and populate the user field
        const lesson = await Lesson.findById(req.params.id).
            populate('user', 'user_name user_email');

        if (!lesson) { // If lesson not found
            return res.status(404).json({ message: 'Lesson not found' }); //######## RETURN ########
        }
        res.status(200).json(lesson);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

/**
 * @desc Update lesson by ID (Reschedule lesson)
 * @route PUT /api/lessons/:id
 * @access Private (Only authenticated users can update a lesson)
 * @param {*} req
 * @param {*} res
 * @returns 404 if lesson not found
*/
exports.updateLessonByID = async (req, res) => {
    try {
        const { lesson_date, lesson_time } = req.body;
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) { // If lesson not found
            return res.status(404).json({ message: 'Lesson not found' }); //######## RETURN ########
        }
        // Check if the time slot is available
        if (lesson_date && lesson_time) {
            const time_slot = await TimeSlot.findOneAndDelete({
                date: lesson_date,
                time: lesson_time
            });

            if (!time_slot) { // If time slot not available
                res.status(400).json({ message: 'Time slot not available' }); //######## RETURN ########
            }

            // Free up the previous time slot
            const previous_time_slot = await TimeSlot.findOne({
                date: lesson.date,
                time: lesson.time
            });

            if (previous_time_slot) {
                previous_time_slot.is_available = true; // Set is_available to true
                previous_time_slot.booked_by = null; // Set booked_by to null
                await previous_time_slot.save(); // Save the updated time slot to the database
            }

            // Assign the new time slot
            time_slot.is_available = false; // Set is_available to false
            time_slot.booked_by = lesson.user; // Set booked_by to user_id
            await time_slot.save(); // Save the updated time slot to the database

            lesson.date = lesson_date; // Update the date of the lesson
            lesson.time = lesson_time; // Update the time of the lesson

        }

        await lesson.save(); // Save the updated lesson to the database
        res.status(200).json({ message: 'Lesson updated successfully' });


    } catch (error) { // If an error occurs
        res.status(500).json({ message: 'Server error', error: error.message });
    }

}

/**
 * @desc Delete lesson by ID (Cancel lesson)
 * @route DELETE /api/lessons/:id
 * @access Private (Only authenticated users can delete a lesson)
 * @param {*} req
 * @param {*} res
 * @returns 404 if lesson not found
 */
exports.deleteLessonByID = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) { // If lesson not found
            return res.status(404).json({ message: 'Lesson not found' }); //######## RETURN ########
        }

        // Free up the time slot
        const time_slot = await TimeSlot.findOne({
            date: lesson.date,
            time: lesson.time
        });

        if (time_slot) {
            time_slot.is_available = true; // Set is_available to true
            time_slot.booked_by = null; // Set booked_by to null
            await time_slot.save(); // Save the updated time slot to the database
        }

        // Refund token to user -- Maybe in the future add a penalty for cancelling
        // to close to the date of the lesson, in that way the token will not be refunded

        const user = await User.findById(lesson.user);
        if (user) {
            user.user_tokens += 1; // Refund one token to the user
            await user.save(); // Save the updated user to the database
        }

        await lesson.deleteOne(); // Remove the lesson from the database
        res.status(200).json({ message: 'Lesson cancelled successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
