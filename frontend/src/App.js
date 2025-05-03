// filepath: frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import PurchasePage from './pages/PurchasePage';
import BookLesson from './pages/BookLesson';
import FaqContactPage from './pages/FaqContactPage';
import AdminCalendar from './pages/AdminCalendar';
function App() {
  //mock user ID
  const currentUserId = '64b7f1a2c9d5e123456789ab';
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.user_role === 'admin';
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/book-lesson" element={<BookLesson />} />
            <Route path="/faq" element={<FaqContactPage />} />

            {/* Protected admin route */}
            <Route
              path="/admin/calendar"
              element={isAdmin ? <AdminCalendar /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
