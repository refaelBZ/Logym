const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('./user.model');

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

  const token = generateToken(newUser);
  // Don't send the password back, even if hashed.
  const userObject = newUser.toObject();
  delete userObject.password;
  
  return { user: userObject, token };
}

module.exports = { login, authenticateToken, signup };
