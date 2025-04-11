// filepath frontend/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';


const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check login status on component mount
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setIsAuthenticated(!!userId);
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/logout', {
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
                <li><a href="#">Book A Lesson</a></li>
                <li><a href="#">FAQ and Contact</a></li>
                {!isAuthenticated ? (
                    <li><a href="/login">Login/Register</a></li>
                ) : (
                    <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
