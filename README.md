# Driver Instructor App

A web application for managing driving lessons, time slots, and purchases. Built with Node.js, Express, MongoDB, and React.js.

## Features
- User authentication and management
- CRUD operations for lessons, time slots, and purchases
- Server-side validation and error handling
- Session and cookie management
- Responsive frontend built with React.js

## Technologies
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js
- **Deployment**: Render

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/KayanGS/driver_instructor_app.git
   ```
2. Install dependencies:
   ```bash
   cd driver_instructor_app
   npm install
   ```

## Tips for Using the Website

### ✉️ Email Notifications for Bookings

This app sends email confirmations when a lesson is booked:
- ✅ To the **user** who booked the lesson (includes date, time, and location).
- ✅ To the **admin** with the name of the user and the scheduled time.

To enable and customize the email feature:

#### 1. Add Email Credentials to `.env`
You must configure your `.env` file with the following variables:
   ```bash
   SMTP_EMAIL=your_gmail_address@gmail.com
   SMTP_PASSWORD=your_gmail_app_password
   ```

> 🔐 **Important:** This is not your Gmail login password. You need to create an [App Password](https://support.google.com/accounts/answer/185833?hl=en) from your Google account.

#### 2. Update the Admin Email
By default, booking notifications are sent to: kayanmiyazono@gmail.com


To change this, open the file: /controllers/LessonController.js

Look for:
```js
await sendEmail({
    to: 'kayanmiyazono@gmail.com',
    ...
});
```

## Project Structure
```
📂 driver_instructor_app/
│── 📂 backend/
│   ├── 📂 config/                  # Database connection
│   │    ├── database.js
│   │    └── session.js
│   ├── 📂 controllers/             # CRUD operations
│   │    ├── LessonController.js
│   │    ├── RegistrationController.js
│   │    └── UserController.js
│   ├── 📂 Middleware/              # Authentication & Authorization Middleware
│   │    ├── authMiddleware.js
│   │    ├── ownershipMiddleware.js
│   │    ├── requestLimiter.js
│   │    └── roleLimiter.js
│   ├── 📂 models/                  # Mongoose models (User, Lesson, Purchase, TimeSlot, etc.)
│   │    ├── Lesson.js
│   │    └── User.js
│   ├── 📂 routes/                  # Express routes (users, lessons, purchases, TimeSlot)
│   │    ├── lesson_routes.js   
│   │    └── user_routes.js
│   ├── 📂 utils/                  # Utils
│   │    ├── sendEmail.js  
│   ├── 📂 validation/              # Server-side validation
│   │    ├── lessonValidation.js
│   │    └── userValidation.js
│   ├── package.json
│   └── server.js                   # Dependencies & scripts
│── 📂 frontend/
│   ├── 📂 public/
│   │    └── index.html
│   ├── 📂 src/
│   │    ├── 📂 assets/
│   │    │    └── logo.png
│   │    ├── 📂 Components/
│   │    │    ├── AuthForm.js
│   │    │    ├── Footer.js
│   │    │    └── Navbar.js
│   │    ├── 📂 pages/
│   │    │    ├── AdminCalendar.js
│   │    │    ├── AuthPage.js
│   │    │    ├── BookLesson.js
│   │    │    ├── FaqContactPage.js
│   │    │    ├── PurchasePage.js
│   │    │    └── WelcomePage.js
│   │    └── 📂 styles/
│   │    │    ├── AdminCalendar.css
│   │    │    ├── Auth.css
│   │    │    ├── BookLesson.css
│   │    │    ├── FaqContactPage.css
│   │    │    ├── Footer.css
│   │    │    ├── Navbar.css
│   │    │    ├── PurchasePage.css
│   │    │    └── WelcomePage.css
│   │    ├── App.js
│   │    ├── index.css
│   │    └── index.js
├── README.md                       # Documentation
```

## Work Distribution
| Task                                      | Assigned To |
|-------------------------------------------|-------------|
| **Improve Session Security**              | Kayan       |
| **Rate Limiting, Controller Structure**   |             |
| **Ownership protection, admin roles**     |             |
| **Remove old UI, setup React Frontend**   |             |
| **w/ routing, auth, and token purchase**  |             |
|                                           |             |
| **Integrate EmailJS for contact form**    | Ekaterina   |
| **Integrate react-calendar in Booking**   |             |
| **Implement Footer component**            |             |
| **FAQ & Contact page, Book Lesson UI**    |             |
