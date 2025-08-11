const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const auth = require('./auth');
const { authenticateToken } = require('./auth');
  const { body, validationResult } = require('express-validator');

//get user by email
router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const user = await userService.getUserByEmail(req.params.id);
        if (user) {
            res.send(user);
        } else {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
    } catch (error) {
        next(error);
    }
});

//Add new user
router.post('/', async (req, res, next) => {
    try {
        const newUser = await userService.addUser(req.body);
        res.status(201).send(newUser);
    } catch (error) {
        next(error);
    }
});

//UPDATE user
router.put('/', authenticateToken, async (req, res, next) => {
    try {
        const { email, ...updateData } = req.body;
        const updatedUser = await userService.updateUser(email, updateData);
        res.send(updatedUser);
    } catch (error) {
        next(error);
    }
});

//login user
router.post('/login', async (req, res, next) => {
    try {
        const token = await auth.login(req.body.email, req.body.password);
        res.json({ token });
    } catch (error) {
        next(error);
    }
});

// forgot password
router.post('/password/forgot', [
  body('email').isEmail().withMessage('Enter a valid email address')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors.array().map(err => err.msg).join(', ');
      const error = new Error(message);
      error.statusCode = 400;
      throw error;
    }
    await auth.requestPasswordReset(req.body.email);
    res.json({ message: 'If an account exists for this email, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
});

// reset password
router.post('/password/reset', [
  body('token').not().isEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors.array().map(err => err.msg).join(', ');
      const error = new Error(message);
      error.statusCode = 400;
      throw error;
    }
    const token = await auth.resetPassword(req.body.token, req.body.password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

//signup
router.post('/signup', [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').not().isEmpty().withMessage('Username is required')
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = errors.array().map(err => err.msg).join(', ');
            const error = new Error(message);
            error.statusCode = 400;
            throw error;
        }

        const { user, token } = await auth.signup(req.body);
        res.status(201).json({ user, token });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
