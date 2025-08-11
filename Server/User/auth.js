const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('./user.model');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('./emailService');
const crypto = require('crypto');

function generateToken(user) {
    return jwt.sign({ userId: user._id }, process.env.SECRET_CODE, { expiresIn: "30d" });
}

async function login(email, password) {
  const user = await User.findOne({ email }).select('+password');

  // For security reasons, give the same error message for both cases
  if (!user) {
    console.log('Authentication failed: User not found with email:', email);
    const error = new Error('Incorrect email or password.');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  const passwordMatch = await bcryptjs.compare(password, user.password);

  if (!passwordMatch) {
    console.log('Authentication failed: Incorrect password for user:', email);
    const error = new Error('Incorrect email or password.');
    error.statusCode = 401;
    throw error;
  }

  console.log('Successfully logged in');
  const token = generateToken(user);
  return token;
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    const error = new Error('No token provided.');
    error.statusCode = 401;
    return next(error);
  }

  jwt.verify(token, process.env.SECRET_CODE, (err, user) => {
    if (err) {
      console.log('Token verification error:', err);
      const error = new Error('Invalid or expired token.');
      error.statusCode = 403; // Forbidden
      return next(error);
    }
    req.user = user;
    next();
  });
};

async function signup(userData) {
  console.log(`Signup: creating user email=${userData.email}, username=${userData.username}`);
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409; // Conflict
      throw error;
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(userData.password, salt);

  const newUser = new User({
      ...userData,
      password: hashedPassword
  });

  await newUser.save();
  console.log(`Signup: user created id=${newUser._id.toString()}, email=${newUser.email}`);

  const token = generateToken(newUser);
  // Don't send the password back, even if hashed.
  const userObject = newUser.toObject();
  delete userObject.password;
  
  // Send welcome email (non-blocking)
  try {
    console.log(`Email: queueing welcome email to ${userObject.email}`);
    // Fire-and-forget to avoid delaying signup response
    sendWelcomeEmail({ email: userObject.email, username: userObject.username })
      .catch((err) => {
        console.error(`Email: failed to send welcome email to ${userObject.email}: ${err && err.message ? err.message : err}`);
      });
  } catch (err) {
    console.error(`Email: failed to queue welcome email to ${userObject.email}: ${err && err.message ? err.message : err}`);
  }
  
  return { user: userObject, token };
}

module.exports = { login, authenticateToken, signup };

async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) {
    // Do not reveal whether the email exists
    return;
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const configured = process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGINS || '';
  const origins = configured
    .split(',')
    .map(o => o.trim())
    .filter(o => o.length > 0);

  if (origins.length === 0) {
    const error = new Error('Reset link is not available. CLIENT_ORIGIN(S) is not configured.');
    error.statusCode = 500;
    throw error;
  }
  const primary = origins[0];
  try {
    const url = new URL(primary);
    if (!/^https?:$/.test(url.protocol) || ['localhost', '127.0.0.1'].includes(url.hostname)) {
      const error = new Error('Reset link cannot use localhost. Please set FRONTEND_BASE_URL to a public origin.');
      error.statusCode = 500;
      throw error;
    }
  } catch (_) {
    const error = new Error('Invalid CLIENT_ORIGIN(S). Please set a valid public URL.');
    error.statusCode = 500;
    throw error;
  }
  const frontendBase = primary.replace(/\/$/, '');
  const resetLink = `${frontendBase}/reset/${resetToken}`;
  console.log(`PasswordReset: building link base=${frontendBase}`);
  await sendPasswordResetEmail({ email: user.email, username: user.username }, resetLink);
}

async function resetPassword(token, newPassword) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }
  });
  if (!user) {
    const error = new Error('Invalid or expired reset token.');
    error.statusCode = 400;
    throw error;
  }
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(newPassword, salt);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  const jwtToken = generateToken(user);
  return jwtToken;
}

module.exports.requestPasswordReset = requestPasswordReset;
module.exports.resetPassword = resetPassword;
