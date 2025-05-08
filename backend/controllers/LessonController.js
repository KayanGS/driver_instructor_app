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
const moment = require('moment-timezone');
const { createEvent } = require('ics');
const fs = require('fs');


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

        const normalizedDate = moment.tz(lesson_date, 'Europe/Dublin').startOf('day').toDate();

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

        const [year, month, day] = [
            normalizedDate.getFullYear(),
            normalizedDate.getMonth() + 1,
            normalizedDate.getDate()
        ];
        const [hour, minute] = lesson_time.split(':').map(Number);

        const eventConfigUser = {
            start: [year, month, day, hour, minute],
            duration: { hours: 1 },
            title: 'Driving Lesson',
            description: 'Your lesson with KV1 Driving School.',
            location: 'KV1 Driving School, Dublin',
            organizer: { name: 'KV1 Driving School', email: 'kv1@example.com' }
        };

        const eventConfigAdmin = {
            start: [year, month, day, hour, minute],
            duration: { hours: 1 },
            title: `Lesson with ${userDoc.user_name}`,
            description: `${userDoc.user_name} booked a driving lesson.`,
            location: 'KV1 Driving School, Dublin',
            organizer: { name: 'KV1 Driving School', email: 'kv1@example.com' }
        };

        // Create and send emails with .ics attachments
        createEvent(eventConfigUser, async (error, value) => {
            if (!error) {
                await sendEmail({
                    to: userDoc.user_email,
                    subject: '✅ Lesson Booking Confirmed - KV1 Driving School',
                    html: htmlUser,
                    attachments: [
                        {
                            filename: 'lesson.ics',
                            content: value
                        }
                    ]
                });
            }
        });

        createEvent(eventConfigAdmin, async (error, value) => {
            if (!error) {
                await sendEmail({
                    to: 'kayanmiyazono@gmail.com',
                    subject: '📌 New Lesson Scheduled - Admin Notification',
                    html: htmlAdmin,
                    attachments: [
                        {
                            filename: 'lesson.ics',
                            content: value
                        }
                    ]
                });
            }
        });

        return res.status(201).json(lesson);
    } catch (error) {
        console.error('❌ Error creating lesson:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
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
        }).populate('user', 'user_name').lean();

        if (!Array.isArray(lessons)) {
            return res.status(500).json({ message: 'Lesson data is not an array.' });
        }

        const formattedLessons = lessons.map(lesson => ({
            ...lesson,
            lesson_date: moment(lesson.lesson_date).tz('Europe/Dublin').format(),
        }));

        console.log('📥 getAllLessons called. Lessons received:', formattedLessons.length);
        return res.status(200).json(formattedLessons);
    } catch (error) {
        console.error('❌ Error in getAllLessons:', error);
        return res.status(500).json({
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
        const lesson = await Lesson.findById(req.params.id).populate('user', 'user_name user_email');

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        if (lesson.user._id.toString() !== req.session.userId) {
            return res.status(403).json({ message: 'Not authorized to update this lesson' });
        }

        const { lesson_date, lesson_time, lesson_status } = req.body;

        if (lesson_date && lesson_time) {
            const newDate = moment.tz(lesson_date, 'Europe/Dublin').startOf('day').toDate();

            const conflict = await Lesson.findOne({
                lesson_date: newDate,
                lesson_time,
                lesson_status: 'scheduled',
                _id: { $ne: lesson._id }
            });

            if (conflict) {
                return res.status(400).json({
                    message: 'That time slot is already booked'
                });
            }

            lesson.lesson_date = newDate;
            lesson.lesson_time = lesson_time;

            const logoUrl = 'https://raw.githubusercontent.com/KayanGS/driver_instructor_app/main/frontend/src/assets/logo.png';

            const htmlUser = `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
                <img src="${logoUrl}" alt="KV1 Logo" style="width: 150px; margin-bottom: 20px;" />
                <h2 style="color: #333;">Lesson Rescheduled</h2>
                <p>Dear ${lesson.user.user_name},</p>
                <p>Your driving lesson has been successfully rescheduled.</p>
                <ul>
                  <li><strong>New Date:</strong> ${newDate.toDateString()}</li>
                  <li><strong>New Time:</strong> ${lesson_time}</li>
                  <li><strong>Location:</strong> KV1 Driving School, Dublin</li>
                </ul>
                <p>Please arrive 10 minutes early and bring your learner permit.</p>
                <br/>
                <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply.</p>
              </div>
            `;

            const htmlAdmin = `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
                <img src="${logoUrl}" alt="KV1 Logo" style="width: 150px; margin-bottom: 20px;" />
                <h2 style="color: #b30000;">Lesson Rescheduled</h2>
                <p><strong>${lesson.user.user_name}</strong> has rescheduled a lesson.</p>
                <ul>
                  <li><strong>New Date:</strong> ${newDate.toDateString()}</li>
                  <li><strong>New Time:</strong> ${lesson_time}</li>
                </ul>
              </div>
            `;

            const [year, month, day] = [
                newDate.getFullYear(),
                newDate.getMonth() + 1,
                newDate.getDate()
            ];
            const [hour, minute] = lesson_time.split(':').map(Number);

            // Calendar event config
            const eventUser = {
                start: [year, month, day, hour, minute],
                duration: { hours: 1 },
                title: 'Driving Lesson',
                description: 'Your lesson with KV1 Driving School.',
                location: 'KV1 Driving School, Dublin',
                organizer: { name: 'KV1 Driving School', email: 'kv1@example.com' }
            };

            const eventAdmin = {
                start: [year, month, day, hour, minute],
                duration: { hours: 1 },
                title: `Lesson with ${lesson.user.user_name}`,
                description: `${lesson.user.user_name} rescheduled their lesson.`,
                location: 'KV1 Driving School, Dublin',
                organizer: { name: 'KV1 Driving School', email: 'kv1@example.com' }
            };

            // Generate and send both calendar invites
            createEvent(eventUser, async (err, userICS) => {
                if (!err) {
                    await sendEmail({
                        to: lesson.user.user_email,
                        subject: '🔁 Lesson Rescheduled - KV1 Driving School',
                        html: htmlUser,
                        attachments: [{
                            filename: 'lesson.ics',
                            content: userICS
                        }]
                    });
                }
            });

            createEvent(eventAdmin, async (err, adminICS) => {
                if (!err) {
                    await sendEmail({
                        to: 'kayanmiyazono@gmail.com',
                        subject: '🔁 Lesson Rescheduled - Admin Notification',
                        html: htmlAdmin,
                        attachments: [{
                            filename: 'lesson.ics',
                            content: adminICS
                        }]
                    });
                }
            });
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
};


/**
 * @desc Delete lesson by ID (Cancel lesson)
 * @route DELETE /api/lessons/:id
 * @access Private (Only authenticated users can delete a lesson)
 */
exports.deleteLessonByID = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('user', 'user_name user_email user_tokens');

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check ownership
        if (lesson.user._id.toString() !== req.session.userId) {
            return res.status(403).json({ message: 'Not authorized to cancel this lesson' });
        }

        // Compute lesson datetime
        const lessonDateTime = moment
            .tz(lesson.lesson_date, 'Europe/Dublin')
            .hour(Number(lesson.lesson_time.split(':')[0]))
            .minute(Number(lesson.lesson_time.split(':')[1]));

        const now = moment.tz('Europe/Dublin');

        if (lessonDateTime.diff(now, 'hours', true) < 3) {
            return res.status(400).json({ message: 'Lessons can only be cancelled at least 3 hours in advance.' });
        }

        const logoUrl = 'https://raw.githubusercontent.com/KayanGS/driver_instructor_app/main/frontend/src/assets/logo.png';

        const htmlUser = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
            <img src="${logoUrl}" alt="KV1 Logo" style="width: 150px; margin-bottom: 20px;" />
            <h2 style="color: #333;">Lesson Cancelled</h2>
            <p>Dear ${lesson.user.user_name},</p>
            <p>Your driving lesson has been successfully cancelled.</p>
            <ul>
              <li><strong>Date:</strong> ${lesson.lesson_date.toDateString()}</li>
              <li><strong>Time:</strong> ${lesson.lesson_time}</li>
            </ul>
            <p>Your token has been restored to your account.</p>
          </div>
        `;

        const htmlAdmin = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
            <img src="${logoUrl}" alt="KV1 Logo" style="width: 150px; margin-bottom: 20px;" />
            <h2 style="color: #b30000;">Lesson Cancelled</h2>
            <p><strong>${lesson.user.user_name}</strong> has cancelled a driving lesson.</p>
            <ul>
              <li><strong>Date:</strong> ${lesson.lesson_date.toDateString()}</li>
              <li><strong>Time:</strong> ${lesson.lesson_time}</li>
            </ul>
          </div>
        `;

        await sendEmail({
            to: lesson.user.user_email,
            subject: '❌ Lesson Cancelled - KV1 Driving School',
            html: htmlUser
        });

        await sendEmail({
            to: 'kayanmiyazono@gmail.com',
            subject: '❌ Lesson Cancelled - Admin Notification',
            html: htmlAdmin
        });

        // Return token and delete lesson
        lesson.user.user_tokens += 1;
        await lesson.user.save();

        await lesson.deleteOne();

        res.status(200).json({ message: 'Lesson cancelled successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
