const mongoose = require('mongoose');
require('dotenv').config(); // Load the environment variables from the .env file

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
