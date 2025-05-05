//filepath: frontend/src/pages/WelcomePage.js

// ################################## IMPORTS ##################################
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';
// ################################ END IMPORTS ################################

// ########################## WELCOME PAGE COMPONENT ##########################
const WelcomePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const api = process.env.NODE_ENV === 'development'
                ? 'http://localhost:5000/api'
                : window.location.origin + '/api';

            const res = await fetch(`${api}/users/${userId}`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };


    return (
        <div className="welcome-container">
            <div className="welcome-text">
                {user ? (
                    <>
                        <h1>Welcome, {user.user_name}!</h1>
                        <p>You still have <strong>{user.user_tokens}</strong> token(s) to use.</p>
                        <p>
                            <Link to="/book-lesson" className="book-link">Book a lesson</Link> or{' '}
                            <a href="#services" className="book-link">buy more</a> in our services section below.
                        </p>
                    </>
                ) : (
                    <>
                        <h1>Welcome to KV1</h1>
                        <p>
                            Your trusted partner for learning how to drive safely and confidently.
                            Whether you’re a beginner or looking to refine your skills, we offer personalized lessons designed to fit your pace.
                        </p>
                        <button className="book-button">Book Your Lesson</button>
                    </>
                )}
            </div>

            <div className="services-section" id="services">
                <h2>Services</h2>
                <div className="card-container">
                    <Link to="/purchase?package=individual" className="service-card">
                        <h3>1 Lesson</h3>
                        <p className="price">50€</p>
                        <p>This one-time lesson is great for refreshing your knowledge or preparing for your driving test.</p>
                    </Link>

                    <Link to="/purchase?package=sixpack" className="service-card">
                        <h3>6 Lessons</h3>
                        <p className="price">250€</p>
                        <p>Cover key driving techniques and build confidence with structured lessons tailored to your progress.</p>
                    </Link>

                    <Link to="/purchase?package=twelvepack" className="service-card">
                        <h3>12 Lessons</h3>
                        <p className="price">500€</p>
                        <p>Required for first-time learner permit holders in Ireland, this package ensures you complete all Essential Driver Training (EDT) lessons.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
