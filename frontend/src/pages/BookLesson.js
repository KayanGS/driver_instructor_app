//file: frontend/src/pages/BookLesson.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/BookLesson.css';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00',
  '15:00', '16:00', '17:00', '18:00'];

const BookLesson = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const navigate = useNavigate();

  // 🚨 Redirect if not logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('⚠️ Please login to book a lesson.');
      navigate('/login');
    }
  }, [navigate]);

  const handleContinue = async () => {
    const userId = localStorage.getItem('userId');
    const api = process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/api'
      : window.location.origin + '/api';

    if (!userId || !selectedDate || !selectedTime) {
      alert('Please select a date and time slot!');
      return;
    }

    try {
      const res = await fetch(`${api}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user: userId,
          lesson_date: selectedDate.toISOString(),
          lesson_time: selectedTime
        })
      });

      const data = await res.json();
      console.log('📦 Backend Response:', data);

      if (res.ok) {
        alert('✅ Lesson successfully booked!');
      } else {
      }
    } catch (err) {
    }
  };



  return (
    <div className="book-lesson-container">
      {/* Date Picker */}
      <div className="selector-box">
        <h3>Select Date</h3>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          tileDisabled={({ date, view }) => view === 'month' && (date.getDay() === 0)}
        />
      </div>

      {/* Time Slot Selector */}
      <div className="selector-box">
        <h3>Select Time</h3>
        <div className="time-slots">
          {timeSlots.map(time => (
            <div
              key={time}
              className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <button className="continue-btn" onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default BookLesson;