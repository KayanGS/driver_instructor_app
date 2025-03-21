const TimeSlot = require('../models/TimeSlot');

// Generate Time Slots for the Week (Admin Only)
const generateTimeSlots = async (req, res) => {
    try {


        const hours = [8, 9, 10, 11, 13, 14, 15, 16];

        const today = new Date();
        // Get Monday
        const start_of_week = new Date(today.setDate(today.getDate() - today.getDay() + 1));

        let created_time_slots = [];

        for (let i = 0; i < 5; i++) { // Loop through weekdays (Mon-Fri)
            let day = new Date(start_of_week);
            day.setDate(start_of_week.getDate() + i);

            for (let hour of hours) {
                let timeSlot = new TimeSlot({
                    date: day,
                    time: `${hour}:00`,
                    is_available: true
                });

                await timeSlot.save();
                created_time_slots.push(timeSlot);
            }
        }

        res.status(201).json({
            message: "Time slots generated successfully",
            slots: created_time_slots
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { generateTimeSlots };
