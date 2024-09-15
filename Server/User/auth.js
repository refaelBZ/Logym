
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('./user.model');

function generateToken(user) {
    return jwt.sign({ userId: user._id }, process.env.SECRET_CODE, { expiresIn: "30d" });
}

async function login(email, password) {

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.log('User not found with email:', email);
    throw new Error('Login failed');
  }

  const passwordMatch = await bcryptjs.compare(password, user.password);


  if (!passwordMatch) {
    console.log('Incorrect password for user:', email);
    throw new Error('Login failed');
  } else {
    console.log('Successfully logged in');
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_CODE, { expiresIn: "30d" });
  return token;
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_CODE, (err, user) => {
    if (err) {
      console.log('Error verifying token:', err);
      return res.sendStatus(403);
    }

    req.user = user;

    next();
  });
};

async function signup(userData) {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
      throw new Error('User already exists');
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(userData.password, salt);

  const newUser = new User({
      ...userData,
      password: hashedPassword
  });

  await newUser.save();

  const token = generateToken(newUser);
  return { user: newUser.toObject({ password: 0 }), token };
}

module.exports = { login, authenticateToken,signup };