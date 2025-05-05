// filepath: frontend/src/pages/BookedLessonsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookedLessonsPage.css';

const BookedLessonsPage = () => {
    const [lessons, setLessons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLessons = async () => {
            const api = process.env.NODE_ENV === 'development'
                ? 'http://localhost:5000/api'
                : window.location.origin + '/api';

            try {
                const res = await fetch(`${api}/lessons`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await res.json();
                if (Array.isArray(data)) {
                    setLessons(data);
                }
            } catch (err) {
                console.error('Failed to load lessons:', err);
            }
        };

        fetchLessons();
    }, []);

    return (
        <div className="booked-lessons-container">
            <h2>📚 Your Booked Lessons</h2>
            <ul className="booked-lessons-list">
                {lessons.map(lesson => (
                    <li key={lesson._id}>
                        {new Date(lesson.lesson_date).toDateString()} at {lesson.lesson_time}
                    </li>
                ))}
            </ul>
            <button className="book-again-btn" onClick={() => navigate('/book-lesson')}>
                📅 Book Another Lesson
            </button>
        </div>
    );
};

export default BookedLessonsPage;
