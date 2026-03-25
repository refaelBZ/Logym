const express = require('express');
const app = express();
require('dotenv').config();

// Prevent unhandled errors from crashing the process silently
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception — shutting down:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection — shutting down:', reason);
  process.exit(1);
});

const db = require("./db");
db.connect();

const cors = require('cors');

// Build CORS origins from ENV: CLIENT_ORIGIN or CLIENT_ORIGINS (comma-separated)
const configured = process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGINS || '';
const envOrigins = configured
  .split(',')
  .map(o => o.trim())
  .filter(o => o.length > 0);
const defaultOrigins = ['https://logym.vercel.app', 'https://app.logym.fit', 'http://localhost:5174', 'http://localhost:5173'];
const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins;

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser clients (no Origin header) and health checks
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }
    console.error(`CORS Blocked Origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

const workoutRouter = require('./workout/workoutRouter');
app.use('/workout', workoutRouter);

const userRouter = require('./User/user.router')
app.use("/user", userRouter)

// Verify email transporter (non-blocking)
try {
  const { verifyTransporter } = require('./User/emailService');
  verifyTransporter().catch(() => {});
} catch (_) {
  // ignore if email service not available
}

// Centralized Error Handling Middleware
app.use((error, req, res, next) => {
  console.error(error);

  let statusCode = error.statusCode || 500;
  let message = 'An unexpected error occurred.';

  if (error.name === 'ValidationError') {
    // Mongoose schema validation failure
    statusCode = 400;
    message = Object.values(error.errors).map(e => e.message).join(', ');
  } else if (error.name === 'CastError') {
    // Invalid MongoDB ObjectId or type cast
    statusCode = 400;
    message = 'Invalid ID format.';
  } else if (error.code === 11000) {
    // MongoDB duplicate key
    statusCode = 409;
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  } else if (error.statusCode) {
    message = error.message;
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
});


const PORT = process.env.PORT || 2500;
app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}!`));
