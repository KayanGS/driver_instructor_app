const express = require('express');
const router = express.Router();
const { generateTimeSlots } = require('../controllers/TimeSlotController');

// Admin: Generate time slots for the week
router.post('/time-slots', generateTimeSlots);

module.exports = router;