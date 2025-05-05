const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

/**
 * Sends an email with support for HTML + ICS calendar attachment.
 * @param {Object} options
 * @param {string|string[]} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 * @param {Object[]} [options.attachments]
 */
const sendEmail = async ({ to, subject, html, text = '', attachments = [] }) => {
    const mailOptions = {
        from: `"KV1 Driving School" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        text: text || 'This is a calendar invite from KV1 Driving School.',
        html,
        attachments: attachments.map(att => ({
            ...att,
            contentType: 'text/calendar',
            contentDisposition: 'attachment'
        })),
        alternatives: [
            {
                contentType: 'text/calendar; method=REQUEST; charset=UTF-8',
                content: attachments.length > 0 ? attachments[0].content : ''
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
