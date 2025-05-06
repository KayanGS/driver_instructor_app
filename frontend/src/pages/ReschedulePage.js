import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/BookLesson.css';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const ReschedulePage = () => {
    const { id } = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [bookedLessons, setBookedLessons] = useState([]);
    const navigate = useNavigate();

    const api = 'https://driver-instructor-app-backend.onrender.com/api';


    useEffect(() => {
        const fetchLessons = async () => {
            const res = await fetch(`${api}/lessons`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            if (Array.isArray(data)) setBookedLessons(data);
        };
        fetchLessons();
    }, []);

    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    const isTimeSlotBooked = (time) => {
        return bookedLessons.some(lesson =>
            lesson.lesson_time === time &&
            new Date(lesson.lesson_date).toISOString().split('T')[0] === selectedDateStr &&
            lesson._id !== id
        );
    };

    const handleReschedule = async () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select a new date and time');
            return;
        }

        try {
            const res = await fetch(`${api}/lessons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    lesson_date: selectedDate.toISOString(),
                    lesson_time: selectedTime
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('✅ Lesson rescheduled successfully!');
                navigate('/booked-lessons');
            } else {
                alert('❌ ' + data.message);
            }
        } catch (err) {
            alert('❌ Network error: ' + err.message);
        }
    };

    return (
        <div className="book-lesson-container">
            <h2>📆 Reschedule Lesson</h2>
            <div className="selector-box">
                <h3>Select New Date</h3>
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    tileDisabled={({ date }) => date.getDay() === 0}
                />
            </div>

            <div className="selector-box">
                <h3>Select New Time</h3>
                <div className="time-slots">
                    {timeSlots.map(time => {
                        const disabled = isTimeSlotBooked(time);
                        return (
                            <div
                                key={time}
                                className={`time-slot ${selectedTime === time ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                                onClick={() => !disabled && setSelectedTime(time)}
                            >
                                {time}
                            </div>
                        );
                    })}
                </div>
            </div>

            <button className="continue-btn" onClick={handleReschedule}>Confirm Reschedule</button>
        </div>
    );
};

export default ReschedulePage;
