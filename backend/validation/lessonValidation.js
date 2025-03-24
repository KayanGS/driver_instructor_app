const { body, validationResult } = require('express-validator');

exports.validateLesson = [
    body('user')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid user ID format'),

    body('lesson_date')
        .notEmpty().withMessage('Lesson date is required')
        .isISO8601().withMessage('Lesson date must be a valid date (YYYY-MM-DD)'),

    body('lesson_time')
        .notEmpty().withMessage('Lesson time is required')
        .matches(/^([01]?\d|2[0-3]):[0-5]\d$/).withMessage('Time must be in HH:mm format (e.g., 14:00)'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];