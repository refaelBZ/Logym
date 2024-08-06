//NOT USED RIGHT NOW!

const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const auth = require('./auth');
const { authenticateToken } = require('./auth');

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

router.post('/login', async (req, res) => {
    try {
        const token = await auth.login(req.body.email, req.body.password);
        res.json({ token });
    } catch (error) {
        res.status(401).send({ error: 'Login failed. Check authentication credentials' });
    }
});

module.exports = router;