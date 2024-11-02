const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


// User registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        user = await User.create({
            username,
            password: hashedPassword
        });
        res.json({ message: 'User created' });
        } catch (error) {
            res.status(500).json({ message: error.message });
           } 
        });

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate a token
        const token = jwt.sign({ 
            id: user.id,
            username: user.username
         }, 'Hsdh223#2kddie', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/chat', (req, res) => {
    res.render('chat');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/', (req, res) => {
    // Verify if the user is logged in
    const token = req.header('auth-token');
    if (!token) {
        return res.redirect('/login');
    } else {
        try {
            const decoded = jwt.verify(token, 'Hsdh223#2kddie');
            res.redirect('/chat');
        } catch (error) {
            res.redirect('/login');
        }
    }
});

// Middleware to verify the token
function verifyToken(req, res, next) {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, 'Hsdh223#2kddie');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
}

// Protected route
router.get('/chat', verifyToken, (req, res) => {
    res.render('chat');
});

module.exports = router;
