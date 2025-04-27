// filepath: frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import PurchasePage from './pages/PurchasePage';
import BookLesson from './pages/BookLesson';

function App() {
  //mock user ID
  const currentUserId = '64b7f1a2c9d5e123456789ab';

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/book-lesson" element={<BookLesson />} />
      </Routes>
    </Router>
  );
}

export default App;
