const { body, validationResult } = require('express-validator');

// Validate the lesson data
exports.validateLesson = [
    body('user') // Validate the user ID
        .notEmpty().withMessage('User ID is required') // User ID is required
        .isMongoId().withMessage('Invalid user ID format'), // User ID must be a valid MongoDB ID

    body('lesson_date') // Validate the lesson date
        .notEmpty().withMessage('Lesson date is required') // Lesson date is required
        // Lesson date must be a valid date (YYYY-MM-DD)
        .isISO8601().withMessage('Lesson date must be a valid date (DD/MM/YYYY)')
        // Lesson date must be in the future
        .custom((value, { req }) => { // Custom validation
            // Combine the lesson date and time
            const dateTime = new Date(`${value}T${req.body.lesson_time}`);

            if (dateTime < new Date()) { // If the lesson date and time is in the past
                // Throw an error
                throw new Error('Lesson date and time cannot be in the past');
            }

            return true; // ################# RETURN #################
        }),

    body('lesson_time') // Validate the lesson time
        .notEmpty().withMessage('Lesson time is required') // Lesson time is required
        // Check if the lesson time is one of the following
        .isIn(['08:00', '09:00', '10:00', '13:00', '14:00', '15:00', '16:00',
            '17:00', '18:00'])
        .withMessage('Lesson time must be one of the following: 08:00, 09:00,'
            + ' 10:00, 13:00, 14:00, 15:00, 16:00, 17:00, or 18:00'),

    (req, res, next) => { // Middleware function
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];