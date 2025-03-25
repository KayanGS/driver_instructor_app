const { body, validationResult } = require('express-validator'); // Import the express-validator module

// Validate the user data
exports.validateUser = [
    body('user_name')
        .trim() // Trim the name removing any leading or trailing white spaces
        .notEmpty().withMessage('Name is required') // Check if the name is empty
        .matches(/^[A-Za-z ]+$/) // Check if the name contains only letters and spaces
        .withMessage('Name must only contain letters and spaces'), // Error message if the name is invalid

    body('user_email') // Validate the email
        .trim() // Trim the email removing any leading or trailing white spaces
        .notEmpty().withMessage('Email is required') // Check if the email is empty
        .isEmail().withMessage('Invalid email address'), // Check if the email is in a valid format

    body('user_password') // Validate the password
        .notEmpty().withMessage('Password is required') // Check if the password is empty
        // Check if the password is at least 6 characters long
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        // Check if the password contains letters
        .matches(/[a-zA-Z]/).withMessage('Password must include letters')
        // Check if the password contains numbers
        .matches(/[0-9]/).withMessage('Password must include numbers')
        // Check if the password contains special characters
        .matches(/[!@#$%^&*]/).withMessage('Password must include a special character'),

    (req, res, next) => { // Middleware function to check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];