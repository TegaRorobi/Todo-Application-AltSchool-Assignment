const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const authenticateToken = require('./middleware/authMiddleware');

// Load environment variables from the .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// --- Middleware ---
app.use(express.json()); // Body parser for JSON requests
app.use(cors({
    origin: ['http://localhost:3000', 'https://todo-app-altschool-assignment-client.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Logging Middleware ---
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Routes ---

// Default Route (Public)
app.get('/', (req, res) => { return res.status(200).send('Hello, World!') });

// Authentication Routes (Public)
app.post('/api/signup', authController.signup);
app.post('/api/login', authController.login);

// Task Routes (Protected - require authentication)
app.post('/api/tasks', authenticateToken, taskController.createTask);
app.get('/api/tasks', authenticateToken, taskController.getTasks);
app.put('/api/tasks/:taskId/status', authenticateToken, taskController.updateTaskStatus);
app.delete('/api/tasks/:taskId', authenticateToken, taskController.deleteTask);

// Global Error Handling Middleware to catch errors that are passed to next() from other middleware/routes
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] GLOBAL ERROR: ${err.stack}`);
    res.status(500).json({ error: 'Something went wrong on the server.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(```
Server running on port ${PORT}
API Endpoints:
  POST /api/signup
  POST /api/login
  POST /api/tasks (Protected)
  GET /api/tasks (Protected)
  PUT /api/tasks/:taskId/status (Protected)
  DELETE /api/tasks/:taskId (Protected)
    ```)});
