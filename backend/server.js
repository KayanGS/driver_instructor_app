
//filepath: //backend/server.js

const express = require('express');
const connectDB = require('./config/database.js');

// Models
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Purchase = require('./models/Purchase');
const TimeSlot = require('./models/TimeSlot');

const app = express();
// Middleware
app.use(express.json());
app.use('/api/users', require('./routes/user_routes'));

// Connect to MongoDB
connectDB();

console.log('MongoDB URI:', process.env.MONGODB_URI);

app.get('/', (req, res) => {
    res.send('🚀 Server is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
