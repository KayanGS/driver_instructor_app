// filepath: frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import PurchasePage from './pages/PurchasePage';
import BookLesson from './pages/BookLesson';
import FaqContactPage from './pages/FaqContactPage';

function App() {
  //mock user ID
  const currentUserId = '64b7f1a2c9d5e123456789ab';

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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
