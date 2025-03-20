//filepath: //backend/models/Purchase.js
const mongoose = require('mongoose');

const purchase_schema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    purchase_date: { type: Date, required: true },
    purchase_package: {
        type: String,
        enum: ['individual', 'sixpack', 'twelvepack'],
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchase_schema);