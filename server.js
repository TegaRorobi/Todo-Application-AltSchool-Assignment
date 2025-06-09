const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db'); // MongoDB connection setup
const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const authenticateToken = require('./middleware/authMiddleware');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000; // Use port from env or default to 3000

// --- Middleware ---
app.use(express.json()); // Body parser for JSON requests
app.use(cors({
    origin: ['http://localhost:3000', 'https://todo-app-altschool-assignment-client.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Logging Middleware (Global Error Handling Part 1) ---
// This is a basic request logger. You'd typically use a dedicated logger like Winston.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Routes ---

// Authentication Routes (Public)
app.post('/api/signup', authController.signup);
app.post('/api/login', authController.login);

// Task Routes (Protected - require authentication)
app.post('/api/tasks', authenticateToken, taskController.createTask);
app.get('/api/tasks', authenticateToken, taskController.getTasks);
app.put('/api/tasks/:taskId/status', authenticateToken, taskController.updateTaskStatus);
app.delete('/api/tasks/:taskId', authenticateToken, taskController.deleteTask);

// Global Error Handling Middleware (Part 2)
// This catches errors that are passed to next() from other middleware/routes
// or unhandled errors in async routes.
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] GLOBAL ERROR: ${err.stack}`);
    res.status(500).json({ error: 'Something went wrong on the server.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Endpoints:`);
    console.log(`  POST /api/signup`);
    console.log(`  POST /api/login`);
    console.log(`  POST /api/tasks (Protected)`);
    console.log(`  GET /api/tasks (Protected)`);
    console.log(`  PUT /api/tasks/:taskId/status (Protected)`);
    console.log(`  DELETE /api/tasks/:taskId (Protected)`);
});
