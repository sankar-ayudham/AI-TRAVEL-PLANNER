
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Travel Planner API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

let server;

async function startServer() {
  const mongoUri =
    process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      'Missing MONGODB_URI or MONGO_URI environment variable'
    );
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY environment variable');
  }

  // Connect to MongoDB before accepting requests.
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log('Successfully connected to MongoDB Atlas');

  // Load routes after required configuration has been checked.
  const authRoutes = require('./routes/authRoutes');
  const tripRoutes = require('./routes/tripRoutes');

  app.use('/api/auth', authRoutes);
  app.use('/api/trips', tripRoutes);

  const PORT = process.env.PORT || 5000;

  server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

async function shutdown(signal) {
  console.log(`Received ${signal}; shutting down`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    await mongoose.disconnect();
    process.exitCode = 0;
  } catch (error) {
    console.error('Shutdown failed:', error.message);
    process.exitCode = 1;
  }
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exitCode = 1;
});
