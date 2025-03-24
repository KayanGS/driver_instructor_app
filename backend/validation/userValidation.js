const { body, validationResult } = require('express-validator');

exports.validateUser = [
    body('user_name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .matches(/^[A-Za-z ]+$/).withMessage('Name must only contain letters and spaces'),
    body('user_email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),
    body('user_password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[a-zA-Z]/).withMessage('Password must include letters')
        .matches(/[0-9]/).withMessage('Password must include numbers')
        .matches(/[!@#$%^&*]/).withMessage('Password must include a special character'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];