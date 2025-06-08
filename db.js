const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // These options are deprecated in newer Mongoose versions but common in examples.
            // Mongoose 6+ automatically handles topology and new URL parser.
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true, // Deprecated, use unique in schema directly
            // useFindAndModify: false // Deprecated, use findOneAndUpdate, findOneAndDelete
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
