const express = require('express');
const mongoose = require('mongoose');
const receiptRoutes = require('./receiptRoutes');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', receiptRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`API server is running on http://localhost:${PORT}`);
});
