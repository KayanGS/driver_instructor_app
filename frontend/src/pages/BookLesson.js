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
  const [bookedLessons, setBookedLessons] = useState([]);


  // 🚨 Redirect if not logged in
  useEffect(() => {
    const fetchLessons = async () => {
      const api = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api'
        : window.location.origin + '/api';

      try {
        const res = await fetch(`${api}/lessons`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await res.json();
        if (Array.isArray(data)) setBookedLessons(data);
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
      }
    };

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('⚠️ Please login to book a lesson.');
      navigate('/login');
    } else {
      fetchLessons();
    }
  }, [navigate]);

  const isFullyBooked = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const bookingsForDay = bookedLessons.filter(lesson =>
      new Date(lesson.lesson_date).toISOString().split('T')[0] === dateStr
    );
    return bookingsForDay.length >= timeSlots.length;
  };


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
        navigate('/booked-lessons'); // 👈 redirect to new page
      }

    } catch (err) {
    }
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  const isTimeSlotBooked = (time) => {
    return bookedLessons.some(lesson =>
      lesson.lesson_time === time &&
      new Date(lesson.lesson_date).toISOString().split('T')[0] === selectedDateStr
    );
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
          tileDisabled={({ date, view }) => {
            if (view !== 'month') return false;
            const isSunday = date.getDay() === 0;
            return isSunday || isFullyBooked(date);
          }}

        />
      </div>

      {/* Time Slot Selector */}
      <div className="selector-box">
        <h3>Select Time</h3>
        <div className="time-slots">
          {timeSlots.map(time => {
            const disabled = isTimeSlotBooked(time);
            return (
              <div
                key={time}
                className={`time-slot ${selectedTime === time ? 'selected' : ''} 
                ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setSelectedTime(time)}
              >
                {time}
              </div>
            );
          })}

        </div>
      </div>

      {/* Continue Button */}
      <button className="continue-btn" onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default BookLesson;