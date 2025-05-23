// filepath: frontend/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    // Check login status on component mount
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setIsAuthenticated(!!userId);
    }, []);

    const handleLogout = async () => {
        try {

            const api =
                window.location.hostname === 'localhost'
                    ? 'http://localhost:5000/api'
                    : 'https://driver-instructor-app-backend.onrender.com/api';

            const res = await fetch(`${api}/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (res.ok) {
                localStorage.removeItem('userId');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
                navigate('/login');
            }
        } catch (err) {
            console.error('Logout error:', err.message);
        }
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="KV1 Logo" />
                </Link>
            </div>
            <ul className="nav-links">
                <li><a href="/purchase">Lessons Packages</a></li>

                {
                    isAuthenticated &&
                    <li><a href="/book-lesson">Book A Lesson</a>
                    </li>
                }

                {
                    isAuthenticated &&
                    <li><a href="/booked-lessons">Booked Lessons</a>
                    </li>
                }

                <li><a href="/faq">FAQ and Contact</a></li>
                {isAuthenticated && user?.user_role === 'admin' && (
                    <li><a href="/admin/calendar">Admin Calendar</a></li>
                )}
                {!isAuthenticated ? (
                    <li><a href="/login">Login/Register</a></li>
                ) : (

                    <li>
                        <button
                            className="logout-btn"
                            onClick={handleLogout}>
                            Logout
                        </button>
                    </li>

                )}
            </ul>
        </nav>
    );
};

export default Navbar;
