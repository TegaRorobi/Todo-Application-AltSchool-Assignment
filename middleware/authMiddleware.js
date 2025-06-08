const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure JWT_SECRET is loaded

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Format: "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Log unauthorized attempt
        console.warn(`[${new Date().toISOString()}] Unauthorized access attempt: No token provided.`);
        return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Log forbidden attempt (e.g., invalid or expired token)
            console.warn(`[${new Date().toISOString()}] Forbidden access attempt: Invalid token. Error: ${err.message}`);
            return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
        }
        req.user = user; // Attach user payload to request
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = authenticateToken;
