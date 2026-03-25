const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

function connect() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined — cannot start without a database.');
    process.exit(1);
  }

  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,  // fail fast if DB unreachable on startup
    socketTimeoutMS: 45000,          // drop idle sockets after 45s
  })
  .then(() => { console.log('DB connection success'); })
  .catch(err => {
    console.error('MongoDB initial connection failed:', err.message);
    process.exit(1); // server is useless without a DB — exit so the process manager can restart
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Mongoose will attempt to reconnect.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
}

module.exports = { connect };
