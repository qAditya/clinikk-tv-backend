const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const authenticate = require('../config/auth');

const router = express.Router();

const ADMIN_KEY = process.env.ADMIN_KEY || 'example_admin_key';

router.post('/register', async (req, res) => {
    const { username, password, adminKey } = req.body;
    console.log("Registration request received for username:", username);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdmin = adminKey === ADMIN_KEY;
        const user = new User({ username, password: hashedPassword, isAdmin });
        await user.save();
        console.log("User registered successfully:", user); 
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration error:", err); 
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Login request received for username:", username); 
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found"); 
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ username, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: '1h' });
        console.log("Generated token:", token); 
        res.json({ token, isAdmin: user.isAdmin });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/profile', authenticate, async (req, res) => {
    const { age, diabetes, sex, healthConditions } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { username: req.user.username },
            { healthData: { age, diabetes, sex, healthConditions } },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
