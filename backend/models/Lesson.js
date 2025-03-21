//filepath: //backend/models/Lesson.js
const mongoose = require('mongoose');

const lesson_schema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson_date: { type: Date, required: true },
    lesson_time: { type: String, Required: true },
    lesson_status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled'
    },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lesson_schema);