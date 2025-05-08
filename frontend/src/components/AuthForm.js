import React, { useState } from 'react';

const AuthForm = ({ isLogin }) => {
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_password: ''
    });
    const [message, setMessage] = useState('');

    const api =
        window.location.hostname === 'localhost'
            ? 'http://localhost:5000/api'
            : 'https://driver-instructor-app-backend.onrender.com/api';


    const handleChange = e => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const url = isLogin ? `${api}/login` : `${api}/register`;

        const payload = isLogin
            ? {
                user_email: formData.user_email,
                user_password: formData.user_password
            }
            : formData;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // to enable session cookies
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(
                    `${isLogin ? 'Login' : 'Registration'} successful!`
                );

                if (isLogin) {
                    // store session locally
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('userId', data.user._id);
                    window.location.href = '/'; // redirect to home
                }
            } else {
                setMessage(`❌ ${data.message || 'Something went wrong'}`);
            }
        } catch (err) {
            setMessage('❌ Network error: ' + err.message);
        }
    };

    return (

        <form onSubmit={handleSubmit} style={
            { maxWidth: 400, margin: '0 auto' }
        }>

            {!isLogin && (
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}
            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    name="user_password"
                    value={formData.user_password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>

            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
        </form>
    );
};

export default AuthForm;
