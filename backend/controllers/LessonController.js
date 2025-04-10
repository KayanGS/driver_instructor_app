//filepath: /controllers/LessonController.js

const Lesson = require('../models/Lesson'); // Importing the Lesson model
const User = require('../models/User'); // Importing the User model

/**
 * @desc Create a new lesson (Booking lesson using tokens)
 * @route POST /api/lessons
 * @access Private (Only authenticated users can book a lesson)
 */
exports.createLesson = async (req, res) => {
    try {
        const { user, lesson_date, lesson_time } = req.body;

        // Check for conflicting lesson (same date + time + status = scheduled)
        const existing = await Lesson.findOne({
            lesson_date: new Date(lesson_date),
            lesson_time,
            lesson_status: 'scheduled'
        });

        if (existing) {
            return res.status(409).json({
                message: 'That time slot is already booked'
            }); // ######## RETURN ########
        }

        // Find the user
        const userDoc = await User.findById(user);
        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' }); // ######## RETURN ########
        }

        // Check token balance
        if (userDoc.user_tokens <= 0) {
            return res.status(400).json({
                message: 'Not enough tokens to book a lesson'
            }); // ######## RETURN ########
        }

        // Create the lesson
        const lesson = new Lesson({
            user,
            lesson_date,
            lesson_time
        });

        await lesson.save();

        // Update user
        userDoc.user_tokens -= 1;
        userDoc.lessons.push(lesson._id);
        await userDoc.save();

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
        const lessons = await Lesson.find({})
            .populate({ path: 'user', select: '_id user_name user_email' })
            .select('lesson_date lesson_time lesson_status user')
            .sort({ lesson_date: 1, lesson_time: 1 });

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
