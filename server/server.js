// Load secret environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import the route files we just created
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');

// Initialize the Express application
const app = express();

// Middleware setup
// CORS allows our React frontend to securely talk to this backend
app.use(cors());
// express.json() allows our server to read JSON data sent in requests
app.use(express.json());

// Mount the routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// A simple health-check route (Required later for Render deployment)
app.get('/', (req, res) => {
  res.send('AI Travel Planner Backend is running successfully!');
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB. Error details:');
    console.error(err);
  });

// Start the server
// Render provides a dynamic PORT. If testing locally, it defaults to 5000.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and actively listening on port ${PORT}`);
});