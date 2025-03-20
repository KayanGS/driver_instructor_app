//filepath: //backend/routes/timeSlot_routes.js
const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');

//Create a new time slot
router.post('/create_time', async (req, res) => {
    // Try to create a new time slot
    try {
        // Get time slot details from request body
        const { date, time } = req.body;
        // Create a new time slot
        const new_time_slot = new TimeSlot({ date, time });
        await new_time_slot.save(); // Save the new time slot

        // Send a success response to the client
        res.status(200).json({
            message: 'Time slot created successfully',
            TimeSlot: new_time_slot,
        });
        // If an error occurs, send an error response to the client
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all time slots
router.get('/', async (req, res) => {
    try {
        const time_slots = await TimeSlot.find();
        res.json(time_slots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

