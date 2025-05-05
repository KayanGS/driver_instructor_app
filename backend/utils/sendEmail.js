// filepath: /utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,       // your Gmail
        pass: process.env.SMTP_PASSWORD     // app password
    }
});

/**
 * Sends an email with HTML formatting and optional fallback plain text.
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient(s)
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text fallback
 * @param {string} options.html - HTML content of the email
 */
const sendEmail = async ({ to, subject, html, text = '' }) => {
    const mailOptions = {
        from: `"KV1 Driving School" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        text,
        html,
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
