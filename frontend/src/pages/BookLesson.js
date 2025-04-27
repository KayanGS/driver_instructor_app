import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // Default styles
import '../styles/BookLesson.css'; //custom styles

const lessonTypes = [
  { id: 'single', label: 'Single Lesson', price: '50€', description: '60 minutes class.' },
  { id: 'package6', label: '6-Lesson Package', price: '250€', description: '6×60 Minutes Classes.' },
  { id: 'package12', label: '12-Lesson Package', price: '500€', description: '12 Mandatory 60 minutes EDT Lessons.' }
];

const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

const BookLesson = () => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  const handleContinue = () => {
    if (!selectedType || !selectedDate || !selectedTime) {
      alert('Please select lesson type, date, and time slot!');
    } else {
      alert(`Lesson booked!\nType: ${selectedType}\nDate: ${selectedDate.toDateString()}\nTime: ${selectedTime}`);
    }
  };

  return (
    <div className="book-lesson-container">
      
      {/* Lesson Type Selector */}
      <div className="selector-box">
        <h3>Select Lesson Type</h3>
        {lessonTypes.map(type => (
          <div
            key={type.id}
            className="lesson-type-option"
            onClick={() => setSelectedType(type.label)}
            style={{ backgroundColor: selectedType === type.label ? '#bbb' : '#ccc' }}
          >
            <div>
              <strong>{type.label}</strong>
              <p>{type.description}</p>
            </div>
            <div>{type.price}</div>
          </div>
        ))}
      </div>

      {/* Date Picker */}
      <div className="selector-box">
        <h3>Select Date</h3>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}  // Disable past dates
          tileDisabled={({ date, view }) => view === 'month' && (date.getDay() === 0)}  // Disable Sundays
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
