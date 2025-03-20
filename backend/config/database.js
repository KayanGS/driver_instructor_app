<<<<<<< Updated upstream
=======
//filepath: backend/config/database.js
// Load environment variables
require('dotenv').config({ path: '../.env' });
>>>>>>> Stashed changes
const mongoose = require('mongoose');


//Used for debbuging
//console.log('Environment Variables:', process.env);
//console.log('MongoDB URI:', process.env.MONGODB_URI);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;
