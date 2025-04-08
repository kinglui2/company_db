const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();

// ✅ CORS configuration to allow localhost and Ngrok frontend
const allowedOrigins = [
  'http://localhost:5173',  // Localhost frontend (for local development)
  'https://3a49-102-164-54-1.ngrok-free.app',  // Ngrok frontend (for remote access)
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

// ✅ Connect to DB (Make sure you replace this with your actual DB connection code if needed)
// db.connect(); // Uncomment and modify this if needed

// ✅ Routes - Handles requests to '/api/companies' (already defined in your routes)
const companyRoutes = require('./routes/companyRoutes');
app.use('/api/companies', companyRoutes);  // Attach company routes to this endpoint

// ✅ Server listen - Ensure that your backend listens on all network interfaces
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

