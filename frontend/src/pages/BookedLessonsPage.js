// filepath: frontend/src/pages/BookedLessonsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookedLessonsPage.css';

const BookedLessonsPage = () => {
    const [lessons, setLessons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLessons = async () => {
      const api = 'https://driver-instructor-app-backend.onrender.com/api';
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
    const handleDelete = async (lessonId, lessonDate, lessonTime) => {
        const confirm = window.confirm('❌ Are you sure you want to cancel this lesson?');

        if (!confirm) return;

        const lessonDateTime = new Date(`${lessonDate}T${lessonTime}`);
        const now = new Date();
        const hoursDiff = (lessonDateTime - now) / (1000 * 60 * 60);

        if (hoursDiff < 3) {
            alert('⚠️ You can only cancel a lesson at least 3 hours before the scheduled time.');
            return;
        }

        try {
            const api = 'https://driver-instructor-app-backend.onrender.com/api';

            const res = await fetch(`${api}/lessons/${lessonId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await res.json();
            if (res.ok) {
                alert('✅ Lesson cancelled and token returned!');
                setLessons(prev => prev.filter(l => l._id !== lessonId));
            } else {
                alert('❌ ' + (data.message || 'Something went wrong.'));
            }
        } catch (err) {
            console.error('Delete error:', err.message);
            alert('❌ Network error while deleting the lesson.');
        }
    };


    return (
        <div className="booked-lessons-container">
            <h2>📚 Your Booked Lessons</h2>
            <ul className="booked-lessons-list">
                {lessons.map(lesson => (
                    <li key={lesson._id}>
                        <span className="lesson-info">
                            {new Date(lesson.lesson_date).toDateString()} at {lesson.lesson_time}
                        </span>
                        {lesson.lesson_status === 'scheduled' && (
                            <div className="lesson-actions">
                                <button
                                    className="reschedule-btn"
                                    onClick={() => navigate(`/reschedule/${lesson._id}`)}
                                >
                                    🔁 Reschedule
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDelete(lesson._id, lesson.lesson_date, lesson.lesson_time)
                                    }
                                >
                                    X Cancel
                                </button>
                            </div>
                        )}
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
