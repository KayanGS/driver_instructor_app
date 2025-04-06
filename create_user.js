// create-user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./backend/models/User'); // adjust if path differs

const MONGO_URI = 'mongodb+srv://kayan:Ql252JIJvuYHa4rM@cluster0.xvk8r.mongodb.net/mydatabase?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const createUser = async () => {
  const hashedPassword = await bcrypt.hash('test1234', 10);

  const user = new User({
    user_name: 'Test Student',
    user_email: 'student@example.com',
    user_password: hashedPassword,
    user_role: 'user', // change to 'admin' if you want instructor
    user_tokens: 0
  });

  try {
    await user.save();
    console.log('User created successfully!');
  } catch (err) {
    console.error('Error creating user:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

createUser();