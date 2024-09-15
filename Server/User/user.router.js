const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const auth = require('./auth');
const { authenticateToken } = require('./auth');
const { body, validationResult } = require('express-validator');


//get user by email
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(404).send(error);
    }
});

//Add new user

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const newUser = await userService.addUser(req.body);
        if (newUser) {
            res.send(newUser);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//UPDATE user

router.put('/', authenticateToken, async (req, res) => {
    try {
        // console.log(req.body);


        const { email, ...updateData } = req.body;
        const updatedUser = await userService.updateUser(email, updateData);
        if (updatedUser) {
            res.send(updatedUser);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//login user

router.post('/login', async (req, res) => {
    try {
        const token = await auth.login(req.body.email, req.body.password);
        res.json({ token });
    } catch (error) {
        res.status(401).send({ error: 'Login failed. Check authentication credentials' });
    }
});

//signup
router.post('/signup', [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').not().isEmpty().withMessage('Username is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { user, token } = await auth.signup(req.body);
        res.status(201).json({ user, token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(400).json({ error: error.message });
    }
});


// router.post('/forgot-password', [
//     body('email').isEmail().withMessage('Enter a valid email address')
//   ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
  
//     try {
//       const result = await auth.forgotPassword(req.body.email);
//       res.json(result);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   });
  
//   router.post('/reset-password/:token', [
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
//   ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
  
//     try {
//       const result = await auth.resetPassword(req.params.token, req.body.password);
//       res.json(result);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   });


module.exports = router;