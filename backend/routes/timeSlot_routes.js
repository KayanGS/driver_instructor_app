//filepath: //backend/routes/timeSlot_routes.js
const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');

//Create a new time slot

router.post('/create_time', async (req, res) => {
    try {
        const { date, time } = req.body;
        const new_time_slot = new TimeSlot({ date, time });
        await new_time_slot.save();

        res.status(200).json({
            message: 'Time slot created successfully',
            TimeSlot: new_time_slot
        });

    } catch (error) {
    }

});

