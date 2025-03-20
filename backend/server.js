<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

// Models
const user = require('./models/User');
const lesson = require('./models/Lesson');
const time_slot = require('./models/TimeSlot');
const purchase = require('./models/Purchase');
=======
//filepath: //backend/server.js

const express = require('express');
=======
//filepath: //backend/server.js

const express = require('express');
>>>>>>> Stashed changes
=======
//filepath: //backend/server.js

const express = require('express');
>>>>>>> Stashed changes
const connectDB = require('./config/database.js');

// Models
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Purchase = require('./models/Purchase');
const TimeSlot = require('./models/TimeSlot');

<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

// Initialize app
const app = express();
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session setup
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
app.use(express.json());
app.use('/api/users', require('./routes/user_routes'));

// Connect to MongoDB
connectDB();
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

// Routes
app.use('/', require('./routes/indexRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/lessons', require('./routes/lessonRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
