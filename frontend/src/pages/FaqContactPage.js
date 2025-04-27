import React from 'react';
import '../styles/FaqContactPage.css';

const FaqContactPage = () => {
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

        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit" className="send-message-btn">Send Message</button>
        </form>
      </section>

    </div>
  );
};

export default FaqContactPage;
