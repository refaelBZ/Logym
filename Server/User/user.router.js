const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const userService = require('./user.service');
const auth = require('./auth');
const { authenticateToken } = require('./auth');
const { body, validationResult } = require('express-validator');
const { validateSignupConsent } = require('./compliance');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many attempts. Please try again later.' },
});

const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many password requests. Please try again later.' },
});

function throwIfInvalid(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map(e => e.msg).join(', '));
    error.statusCode = 400;
    throw error;
  }
}

// Current authenticated user (replaces IDOR-prone GET /:id for self lookups)
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// GDPR data export
router.get('/me/export', authenticateToken, async (req, res, next) => {
  try {
    const data = await userService.exportAccount(req.user.userId);
    res.setHeader('Content-Disposition', 'attachment; filename="logym-data-export.json"');
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// GDPR account erasure
router.delete('/me', authenticateToken, async (req, res, next) => {
  try {
    const result = await userService.deleteAccount(req.user.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Health disclaimer acknowledgement (for existing accounts)
router.post('/me/health-disclaimer', authenticateToken, async (req, res, next) => {
  try {
    const user = await userService.acceptHealthDisclaimer(req.user.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Get user by email — only the authenticated owner may read their own record (IDOR fix)
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const requester = await userService.getUserById(req.user.userId);
    if (!requester) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const requestedKey = (req.params.id || '').toString().trim().toLowerCase();
    const ownsRecord =
      requester.email === requestedKey ||
      requester._id.toString() === req.params.id;

    if (!ownsRecord) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }

    const user = await userService.getUserByEmail(requester.email);
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

// UPDATE user — use JWT identity; whitelist fields only (mass-assignment fix)
router.put('/', authenticateToken, [
  body('stepSize').optional().isInt({ min: 1, max: 10 }).withMessage('Step size must be an integer between 1 and 10'),
  body('username').optional().trim().notEmpty().withMessage('Username cannot be empty'),
], async (req, res, next) => {
  try {
    throwIfInvalid(req);
    const updatedUser = await userService.updateUserById(req.user.userId, req.body);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

// login user
router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('A valid email address is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res, next) => {
  try {
    throwIfInvalid(req);
    const token = await auth.login(req.body.email, req.body.password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// forgot password
router.post('/password/forgot', passwordLimiter, [
  body('email').isEmail().withMessage('Enter a valid email address')
], async (req, res, next) => {
  try {
    throwIfInvalid(req);
    await auth.requestPasswordReset(req.body.email);
    res.json({ message: 'If an account exists for this email, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
});

// reset password
router.post('/password/reset', passwordLimiter, [
  body('token').not().isEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res, next) => {
  try {
    throwIfInvalid(req);
    const token = await auth.resetPassword(req.body.token, req.body.password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// signup
router.post('/signup', authLimiter, [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('username').not().isEmpty().withMessage('Username is required'),
], async (req, res, next) => {
  try {
    throwIfInvalid(req);

    const normalized = {
      ...req.body,
      acceptedTerms: req.body.acceptedTerms === true || req.body.acceptedTerms === 'true',
      acceptedPrivacy: req.body.acceptedPrivacy === true || req.body.acceptedPrivacy === 'true',
      ageConfirmed: req.body.ageConfirmed === true || req.body.ageConfirmed === 'true',
      acceptedHealthDisclaimer:
        req.body.acceptedHealthDisclaimer === true || req.body.acceptedHealthDisclaimer === 'true',
    };

    const missing = validateSignupConsent(normalized);
    if (missing.length > 0) {
      const error = new Error(
        'You must accept the Terms, Privacy Policy, confirm you are 16+, and acknowledge the health disclaimer.'
      );
      error.statusCode = 400;
      throw error;
    }

    const { user, token } = await auth.signup(normalized);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
});

// Open POST /user/ removed — registration is only via /signup with consent checks.

module.exports = router;
