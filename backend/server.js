const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();

// CORS configuration for local development
const allowedOrigins = [
  'http://localhost:5173'  // Local frontend development server
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Ensures cookies or authorization headers are sent with requests
};

app.use(cors(corsOptions));  // Use the defined CORS settings
app.use(express.json());  // Parse JSON request bodies

// Test database connection
db.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// Routes
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');

// Public routes
app.use('/api/users', userRoutes);

// Protected routes
app.use('/api/companies', companyRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

