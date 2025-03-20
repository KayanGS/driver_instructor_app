//filepath: //backend/models/User.js
const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({

    user_name: { type: String, required: true },
    user_email: { type: String, required: true, unique: true },
    user_password: { type: String, required: true },
    user_role: { type: String, enum: ['user', 'admin'], default: 'user' },
    user_tokens: { type: Number, default: 0, min: 0 },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
}, { timestamps: true });

module.exports = mongoose.model('User', user_schema);