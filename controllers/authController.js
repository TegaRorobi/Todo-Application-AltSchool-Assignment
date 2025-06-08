const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
require('dotenv').config(); // Load JWT_SECRET

// Logging helper (basic console log)
const log = (level, message) => console.log(`[${new Date().toISOString()}] [AUTH] ${level}: ${message}`);

const signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            log('ERROR', 'Signup attempt with missing username or password.');
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            log('WARN', `Signup attempt for existing username: ${username}`);
            return res.status(409).json({ error: 'Username already taken.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            username,
            passwordHash
        });

        await user.save();
        log('INFO', `New user signed up: ${username}`);
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (err) {
        log('ERROR', `Signup failed: ${err.message}`);
        res.status(500).json({ error: 'Server error during signup.' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            log('ERROR', 'Login attempt with missing username or password.');
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            log('WARN', `Login attempt for non-existent username: ${username}`);
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            log('WARN', `Login attempt failed for ${username}: Incorrect password.`);
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, username: user.username }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        log('INFO', `User logged in: ${username}`);
        res.status(200).json({ message: 'Logged in successfully!', token, username: user.username });

    } catch (err) {
        log('ERROR', `Login failed: ${err.message}`);
        res.status(500).json({ error: 'Server error during login.' });
    }
};

module.exports = {
    signup,
    login
};
