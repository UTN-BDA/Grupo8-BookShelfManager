const mongoose = require('mongoose');
const config = require('../config');

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || config.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectMongo;
