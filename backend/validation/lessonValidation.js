const { body, validationResult } = require('express-validator');

// Shared date and time validations
const lessonDateAndTimeValidation = [
    body('lesson_date')
        .notEmpty().withMessage('Lesson date is required')
        .isISO8601().withMessage('Lesson date must be a valid date (YYYY-MM-DD)')
        .custom((value, { req }) => {
            const dateTime = new Date(`${value}T${req.body.lesson_time}`);
            if (dateTime < new Date()) {
                throw new Error('Lesson date and time cannot be in the past');
            }
            return true;
        }),
    body('lesson_time')
        .notEmpty().withMessage('Lesson time is required')
        .isIn(['08:00', '09:00', '10:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'])
        .withMessage('Invalid time selected'),
];

exports.validateLessonForCreate = [
    body('user')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid user ID format'),
    ...lessonDateAndTimeValidation,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        next();
    }
];

exports.validateLessonForUpdate = [
    // No user field required on update
    ...lessonDateAndTimeValidation,
    body('lesson_status')
        .optional()
        .isIn(['scheduled', 'completed', 'cancelled'])
        .withMessage('Invalid lesson status'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        next();
    }
];
