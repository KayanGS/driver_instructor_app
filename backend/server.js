//filepath: //backend/server.js

const express = require('express'); // Import express
const connectDB = require('./config/database.js'); // Import database connection

connectDB(); // Connect to database

//Middleware
const app = express(); // Initialize express
app.use(express.json()); // Parse JSON bodies

// Define routes
const userRoutes = require('./routes/user_routes'); // Import user routes 
const lessonRoutes = require('./routes/lesson_routes');// Import lesson routes
const purchaseRoutes = require('./routes/purchase_routes'); // Import purchase routes
const timeSlotRoutes = require('./routes/timeSlot_routes'); // Import timeSlot routes

app.use('/api', userRoutes); // Use user routes
app.use('/api', lessonRoutes); // Use lesson routes
app.use('/api', purchaseRoutes); // Use purchase routes
app.use('/api', timeSlotRoutes); // Use timeSlot routes


// Start server
const PORT = process.env.PORT || 5000; // Set port
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`)); // Start server
