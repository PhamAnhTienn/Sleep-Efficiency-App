const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.REACT_APP_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

