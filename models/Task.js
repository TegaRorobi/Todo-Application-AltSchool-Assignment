const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // References the User's _id
        ref: 'User', // Specifies that it refers to the 'User' model
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends of a string
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'deleted'], // Enforces allowed values
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update 'updatedAt' field on save
TaskSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update 'updatedAt' field on updateOne/findByIdAndUpdate
TaskSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});


module.exports = mongoose.model('Task', TaskSchema);
