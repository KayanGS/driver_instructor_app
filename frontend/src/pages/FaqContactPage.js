//filepath: frontend/src/pages/FaqContactPage.js
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/FaqContactPage.css';

const FaqContactPage = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_s0z4nma', 'template_yhztzif', form.current, 'VOEjfLOyyqjmOvir6')
      .then((result) => {
        console.log('Message Sent:', result.text);
        alert("Message sent successfully!");
        form.current.reset();
      }, (error) => {
        console.error('EmailJS Error:', error);   // 👈 This will show detailed info
        alert("Failed to send message, please try again.");
      });
  };

  return (
    <div className="faq-contact-container">

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>

        <div className="faq-card">
          <h4>Do I need to complete all 12 lessons to take my driving test?</h4>
          <p>
            If you're a first-time learner permit holder in Ireland, you must complete 12 Essential Driver Training (EDT) lessons before taking your test. However, if you’ve held a valid learner permit before, you may not need to complete all 12.
          </p>
        </div>

        <div className="faq-card">
          <h4>How long is each driving lesson?</h4>
          <p>
            Each lesson lasts one hour, providing enough time for practical learning and feedback. For those who prefer longer sessions, we can arrange back-to-back lessons.
          </p>
        </div>

        <button className="show-more-btn">Show More</button>
      </section>

      {/* Contact Form Section */}
      <section className="contact-section">
        <h2 className="contact-title">Get In Touch</h2>

        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" required></textarea>
          <button type="submit" className="send-message-btn">Send Message</button>
        </form>
      </section>

    </div>
  );
};

export default FaqContactPage;
