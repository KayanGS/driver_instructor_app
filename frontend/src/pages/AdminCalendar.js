// filepath: frontend/src/pages/AdminCalendar.js
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/AdminCalendar.css';

const AdminCalendar = () => {
    const [allLessons, setAllLessons] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dayLessons, setDayLessons] = useState([]);

    // Fetch all scheduled lessons
    useEffect(() => {
        fetch('http://localhost:5000/api/lessons')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAllLessons(data);
                } else if (Array.isArray(data.lessons)) {
                    setAllLessons(data.lessons);
                } else {
                    console.error('Unexpected response format:', data);
                    setAllLessons([]);
                }
            })
            .catch(err => console.error('Error fetching lessons:', err));
    }, []);

    // Handle clicking a day
    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dateStr = new Date(date).toISOString().split('T')[0];
        const filtered = allLessons.filter(lesson => {
            const lessonDate = new Date(lesson.lesson_date).toISOString().split('T')[0];
            return lessonDate === dateStr;
        });

        setDayLessons(filtered);
    };

    // Customize calendar tiles with dots
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            if (!Array.isArray(allLessons)) return null;
            const hasLesson = allLessons.some(l => {
                const lessonDate = new Date(l.lesson_date).toISOString().split('T')[0];
                return lessonDate === dateStr;
            });
            return (
                <div className="dot" style={{ backgroundColor: hasLesson ? 'red' : 'green' }}></div>
            );
        }
        return null;
    };


    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00',
        '15:00', '16:00', '17:00', '18:00'];

    const renderDailySlots = () => {
        return timeSlots.map(time => {
            const lesson = dayLessons.find(lesson => lesson.lesson_time === time);
            const isBooked = Boolean(lesson);

            return (
                <div
                    key={time}
                    className={`time-slot ${isBooked ? 'booked' : 'available'}`}
                >
                    <strong>{time}</strong> {isBooked ? `- ${lesson.user?.user_name || 'Unknown'}` : ''}
                </div>
            );
        });
    };

    return (
        <div className="admin-calendar-container">
            <h2>Admin Lesson Calendar</h2>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={tileContent}
            />

            <div className="daily-slots">
                <h3>Scheduled Lessons for {selectedDate.toDateString()}</h3>
                {renderDailySlots()}
            </div>
        </div>
    );
};

export default AdminCalendar;
