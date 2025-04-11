//filepath: backend/config/database.js
/**
 * @file database.js
 * @requires dotenv
 * @requires mongoose
 * @exports connectDB
 * @description This file contains the database connection logic for the application.
 */

// ############################### IMPORTS ####################################
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose'); // Required for MongoDB connection
// ############################# END IMPORTS #################################

// Used for debbuging
// console.log('Environment Variables:', process.env);
// console.log('MongoDB URI:', process.env.MONGODB_URI);

//############################## DATABASE CONNECTION ###########################
/**
 * Connect to MongoDB database using Mongoose.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
//############################# END DATABASE CONNECTION #######################

module.exports = connectDB; // Export the connectDB function
