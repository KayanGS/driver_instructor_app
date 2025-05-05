//filepath: /controllers/LessonController.js

/**
 * @description Handles lesson-related operations such as creating, updating, deleting, and fetching lessons.
 * @module LessonController
 * @requires module:express
 * @requires module:../models/Lesson
 * @requires module:../models/User
 */

// ################################## IMPORTS ##################################
const Lesson = require('../models/Lesson'); // Importing the Lesson model
const User = require('../models/User'); // Importing the User model
const sendEmail = require('../utils/sendEmail');
/**
 * @desc Create a new lesson (Booking lesson using tokens)
 * @route POST /api/lessons
 * @access Private (Only authenticated users can book a lesson)
 */
exports.createLesson = async (req, res) => {
    try {
        const { user, lesson_date, lesson_time } = req.body;

        const existing = await Lesson.findOne({
            lesson_date: new Date(lesson_date),
            lesson_time,
            lesson_status: 'scheduled'
        });

        if (existing) {
            return res.status(409).json({
                message: 'That time slot is already booked'
            });
        }

        const userDoc = await User.findById(user);
        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userDoc.user_tokens <= 0) {
            return res.status(400).json({
                message: 'Not enough tokens to book a lesson'
            });
        }

        // Normalize date
        const normalizedDate = new Date(lesson_date);
        normalizedDate.setUTCHours(0, 0, 0, 0);

        const lesson = new Lesson({
            user,
            lesson_date: normalizedDate,
            lesson_time
        });

        await lesson.save();

        userDoc.user_tokens -= 1;
        userDoc.lessons.push(lesson._id);
        await userDoc.save();

        const logoUrl = 'https://raw.githubusercontent.com/KayanGS/driver_instructor_app/main/frontend/src/assets/logo.png';

        const htmlUser = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
            <img src="${logoUrl}" alt="KV1 Logo" style="width: 150px; margin-bottom: 20px;" />
            <h2 style="color: #333;">Lesson Booking Confirmation</h2>
            <p>Dear ${userDoc.user_name},</p>
            <p>We are pleased to confirm your driving lesson booking with <strong>KV1 Driving School</strong>.</p>
            <ul>
              <li><strong>Date:</strong> ${normalizedDate.toDateString()}</li>
              <li><strong>Time:</strong> ${lesson_time}</li>
              <li><strong>Location:</strong> KV1 Driving School, Dublin</li>
            </ul>
            <p>Thank you for choosing us. Please arrive 10 minutes early and bring your learner permit.</p>
            <br/>
            <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply.</p>
          </div>
        `;

        await sendEmail({
            to: userDoc.user_email,
            subject: '✅ Lesson Booking Confirmed - KV1 Driving School',
            html: htmlUser
        });

        const htmlAdmin = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
            <img src="${logoUrl}" alt="KV1 Logo" style="width: 150px; margin-bottom: 20px;" />
            <h2 style="color: #b30000;">New Lesson Booked</h2>
            <p><strong>${userDoc.user_name}</strong> has just booked a new lesson.</p>
            <ul>
              <li><strong>Date:</strong> ${normalizedDate.toDateString()}</li>
              <li><strong>Time:</strong> ${lesson_time}</li>
            </ul>
            <p>Please update the admin calendar if needed.</p>
          </div>
        `;

        await sendEmail({
            to: 'kayanmiyazono@gmail.com',
            subject: '📌 New Lesson Scheduled - Admin Notification',
            html: htmlAdmin
        });

        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc Get lesson by ID
 * @route GET /api/lessons/:id
 * @access Private (Only authenticated users can get a lesson)
 */
exports.getLessonByID = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)
            .populate('user', 'user_name user_email');

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' }); //######## RETURN ########
        }
        res.status(200).json(lesson);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

/**
 * @desc Get all lessons
 * @route GET /api/lessons
 * @access Private (Only authenticated users can get all lessons)
 */
exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({
            _id: { $in: req.filteredLessons.map(l => l._id) }
        }).populate('user', 'user_name');



        if (!Array.isArray(lessons)) {
            return res.status(500).json({ message: 'Lesson data is not an array.' });
        }
        console.log('📥 getAllLessons called. Lessons received:', req.filteredLessons?.length);

        res.status(200).json(lessons);
    } catch (error) {
        console.error('❌ Error in getAllLessons:', error);
        res.status(500).json({
            message: 'Server error while fetching lessons',
            error: error.message
        });
    }
};




/**
 * @desc Update lesson by ID (Reschedule lesson)
 * @route PUT /api/lessons/:id
 * @access Private (Only authenticated users can update a lesson)
 */
exports.updateLessonByID = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // 🔒 Check ownership
        if (lesson.user.toString() !== req.session.userId) {
            return res.status(403).json({ message: 'Not authorized to update this lesson' });
        }

        const { lesson_date, lesson_time, lesson_status } = req.body;

        if (lesson_date && lesson_time) {
            const conflict = await Lesson.findOne({
                lesson_date: new Date(lesson_date),
                lesson_time,
                lesson_status: 'scheduled',
                _id: { $ne: lesson._id }
            });

            if (conflict) {
                return res.status(400).json({
                    message: 'That time slot is already booked'
                });
            }

            lesson.lesson_date = lesson_date;
            lesson.lesson_time = lesson_time;
        }

        if (lesson_status) lesson.lesson_status = lesson_status;

        await lesson.save();
        res.status(200).json({
            message: 'Lesson updated successfully',
            lesson
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

/**
 * @desc Delete lesson by ID (Cancel lesson)
 * @route DELETE /api/lessons/:id
 * @access Private (Only authenticated users can delete a lesson)
 */
exports.deleteLessonByID = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' }); //######## RETURN ########
        }

        const user = await User.findById(lesson.user);
        if (user) {
            user.user_tokens += 1;
            await user.save();
        }

        await lesson.deleteOne();
        res.status(200).json({ message: 'Lesson cancelled successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
