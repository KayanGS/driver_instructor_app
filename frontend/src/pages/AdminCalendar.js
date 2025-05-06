// filepath: frontend/src/pages/AdminCalendar.js

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/AdminCalendar.css';

const AdminCalendar = () => {
    const [allLessons, setAllLessons] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dayLessons, setDayLessons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [newTime, setNewTime] = useState('');

    // Fetch all scheduled lessons
    useEffect(() => {
        fetch('https://driver-instructor-app-backend.onrender.com/api/lessons', {
            method: 'GET',
            credentials: 'include', // REQUIRED for session to be sent
        })
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

    const toIrishDateStr = (date) =>
        new Date(date).toLocaleDateString('en-IE', { timeZone: 'Europe/Dublin' });

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dateStr = toIrishDateStr(date);
        const filtered = allLessons.filter(lesson => {
            return toIrishDateStr(lesson.lesson_date) === dateStr;
        });
        setDayLessons(filtered);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = toIrishDateStr(date);
            const hasLesson = allLessons.some(l => toIrishDateStr(l.lesson_date) === dateStr);
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
            const lesson = dayLessons?.find(l => {
                return l?.lesson_time && l.lesson_time.trim().slice(0, 5) === time;
            });

            const isBooked = Boolean(lesson);
            const displayName = isBooked ? lesson.user?.user_name || 'Unknown' : 'Free';

            return (
                <div
                    key={time}
                    className={`time-slot ${isBooked ? 'booked' : 'available'}`}
                    onClick={() => {
                        if (lesson) {
                            setSelectedLesson(lesson);
                            setShowModal(true);
                        }
                    }}
                >
                    <strong>{time}</strong> {isBooked ? `- ${displayName}` : ''}
                </div>
            );
        });
    };

    const handleReschedule = async () => {
        if (!newTime) {
            alert('Please select a new time.');
            return;
        }

        try {
            const res = await fetch(`https://driver-instructor-app-backend.onrender.com/api/lessons/${selectedLesson._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    lesson_date: selectedLesson.lesson_date,
                    lesson_time: newTime
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('✅ Lesson rescheduled!');
                setShowModal(false);
                setSelectedLesson(null);
                window.location.reload(); // Refresh the calendar
            } else {
                alert('❌ ' + data.message);
            }
        } catch (err) {
            alert('❌ Error: ' + err.message);
        }
    };
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) return;

        try {
            const res = await fetch(`https://driver-instructor-app-backend.onrender.com/api/lessons/${selectedLesson._id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                alert('🗑️ Lesson deleted successfully!');
                setShowModal(false);
                setSelectedLesson(null);
                window.location.reload();
            } else {
                const data = await res.json();
                alert('❌ ' + data.message);
            }
        } catch (err) {
            alert('❌ Network error: ' + err.message);
        }
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

            {showModal && selectedLesson && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Manage Lesson</h3>
                        <p><strong>User:</strong> {selectedLesson.user?.user_name}</p>
                        <p><strong>Current Time:</strong> {selectedLesson.lesson_time}</p>

                        <label htmlFor="new-time">New Time:</label>
                        <select
                            id="new-time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                        >
                            <option value="">-- Select New Time --</option>
                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>

                        <div className="modal-actions">
                            <button onClick={handleReschedule}>✅ Reschedule</button>
                            <button onClick={handleDelete}>🗑️ Delete</button>
                            <button onClick={() => setShowModal(false)}>❌ Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCalendar;
