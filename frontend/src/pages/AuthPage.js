import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import '../styles/Auth.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                <AuthForm isLogin={isLogin} />
                <p>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
