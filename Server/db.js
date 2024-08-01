const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

function connect() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
  }
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => { console.log("DB connection success"); })
  .catch(err => { console.log("MongoDB ERROR:", err); });
}

module.exports = { connect };
