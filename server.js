// Importing required modules
const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");

// Initialize Express app
const app = express();

// Load environment variables
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json()); // Parse incoming JSON payloads

// Routes
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contacts", contactRoutes);

// Catch-all route for undefined routes
app.use((req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass error to the custom error handler
});


// Custom error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
