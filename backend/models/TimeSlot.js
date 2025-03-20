//filepath: //backend/models/TimeSlot.js
const mongoose = require('mongoose');

const time_slot_schema = new mongoose.Schema({

    date: { type: Date, required: true },
    time: { type: String, required: true },
    is_available: { type: Boolean, default: true },
    booked_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

}, { timestamps: true });

module.exports = mongoose.model('TimeSlot', time_slot_schema);