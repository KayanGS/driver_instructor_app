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
- **Deployment**: Not Decided yet

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

## Project Structure
```
📂 driver_instructor_app/
│── 📂 backend/
│   ├── 📂 config/                  # Database connection
│   │    ├── database.js
│   ├── 📂 controllers/             # CRUD operations
│   │    ├── LessonController.js
│   │    ├── TimeSlotController.js
│   │    ├── UserController.js
│   ├── 📂 Middleware/              # Authentication & Authorization Middleware  
│   ├── 📂 models/                  # Mongoose models (User, Lesson, Purchase, TimeSlot, etc.)
│   │    ├── Lesson.js
│   │    ├── Purchase.js
│   │    ├── TimeSlot.js
│   │    ├── User.js
│   ├── 📂 routes/                  # Express routes (users, lessons, purchases, TimeSlot)
│   │    ├── lesson_routes.js
│   │    ├── purchase_routes.js
│   │    ├── timeSlot_routes.js
│   │    ├── user_routes.js
│   ├── server.js                   # Main Express server
├── package.json                    # Dependencies & scripts    
├── .env                            # Environment variables
├── README.md                       # Documentation
```

## Work Distribution
| Task                                      | Assigned To |
|-------------------------------------------|-------------|
| **Project setup & dependencies**          | Kayan       |
| **User authentication (Login/Signup)**    | Ekaterina   |
| **CRUD operations for Users**             | Kayan       |
| **CRUD operations for Time Slots**        | Kayan       |
| **CRUD operations for Purchases**         | Kayan       |
| **Payment system integration**            | Ekaterina   |
| **Session & Cookie Management**           | Ekaterina   |
| **Form validation**                       | Kayan       |
| **JWT Authentication Middleware**         | Ekaterina   |
| **Small frontend UI for testing backend** | Ekaterina   |
| **Deployment & Documentation**            | Both        |

