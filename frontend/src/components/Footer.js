import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <h4>Contact Info</h4>
        <p>📞 (353) 083 123 4567</p>
        <p>📍 123 streetname, name, Limerick Ireland</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <p><a href="/purchase">Lesson Packages</a></p>
        <p><a href="/book-lesson">Book a lesson</a></p>
        <p><a href="/faq">FAQ & Contact</a></p>
      </div>
      <div>
        <h4>Follow Us</h4>
        <p>🔵 🐦 📸 🎥</p>
      </div>
    </footer>
  );
};

export default Footer;

