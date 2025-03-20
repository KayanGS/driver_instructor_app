//filepath: //backend/server.js

// Load environment variables
require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// Models
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Purchase = require('./models/Purchase');
const TimeSlot = require('./models/TimeSlot');

//Used for debbuging
//console.log('Environment Variables:', process.env);
//MONGODB_URI = 'mongodb+srv://kayan:Ql252JIJvuYHa4rM@cluster0.xvk8r.mongodb.net/mydatabase?retryWrites=true&w=majority';

const app = express();
app.use(bodyParser());
app.use('/api/users', require('./routes/user_routes'));
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('🔥 MongoDB Connected'))
    .catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('🚀 Server is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
