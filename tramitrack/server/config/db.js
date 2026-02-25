const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);
    mongoose.connect(mongoUri)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));
};

module.exports = connectDB;