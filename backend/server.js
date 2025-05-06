//filepath: //backend/server.js

// Load environment variables
require('dotenv').config();

const express = require('express'); // Import express
const connectDB = require('./config/database.js'); // Import database connection
const sessionMiddleware = require('./config/session');
const cors = require('cors');



const path = require('path');

connectDB(); // Connect to database

//Middleware
const app = express(); // Initialize express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(sessionMiddleware);
app.use(express.json()); // Parse JSON bodies

const userRoutes = require('./routes/user_routes'); // Import user routes 
const lessonRoutes = require('./routes/lesson_routes');// Import lesson routes
app.use(cors({
    origin: [
        'https://driver-instructor-app.vercel.app/', 
        'http://localhost:3000' // optional for local dev
    ],
    credentials: true
}));

// Middleware   

app.use('/api', userRoutes); // Use user routes
app.use('/api', lessonRoutes); // Use lesson routes


// app.get('/', (req, res) => {
//     res.render('index');
// });
// app.get('/users', (req, res) => {
//     res.render('users');
// });

// app.get('/lessons', (req, res) => {
//     res.render('lessons');
// });





// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));



// Start server
const PORT = process.env.PORT || 5000; // Set port
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`)); // Start server

//Print a link in th trminal to connect to the server
console.log('http://localhost:5000/');
