const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri); // 
    console.log('Connected to MongoDB');
};

module.exports = connectDB;