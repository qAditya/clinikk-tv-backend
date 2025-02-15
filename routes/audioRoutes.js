const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Audio = require('../models/audioModel');
const User = require('../models/userModel'); 
const authenticate = require('../config/auth');

const router = express.Router();
const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Saving file to:", UPLOADS_DIR);
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + '-' + file.originalname;
        console.log("Generated filename:", filename); 
        cb(null, filename);
    }
});
const upload = multer({ storage });

router.post('/upload', authenticate, upload.single('audio'), async (req, res) => {
    console.log("Upload request received"); 
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const { title, tags } = req.body;
    const filePath = `/uploads/${req.file.filename}`;
    console.log("File path:", filePath);
    
    try {
        const audio = new Audio({ title, filePath, tags: tags.split(',') });
        await audio.save();
        console.log("Audio saved successfully:", audio);
        res.json(audio);
    } catch (err) {
        console.error("Error saving audio:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        const tags = [];
        if (user.healthData.diabetes) tags.push('diabetes');
        if (user.healthData.age > 50) tags.push('age_50_plus');
        const audios = await Audio.find({ tags: { $in: tags } });
        res.json(audios);
    } catch (err) {
        console.error("Error fetching audios:", err); 
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    console.log("Delete request received for audio ID:", req.params.id);
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
    }
    try {
        const audio = await Audio.findByIdAndDelete(req.params.id);
        if (!audio) {
            return res.status(404).json({ message: "Audio not found" });
        }
        fs.unlinkSync(path.join(__dirname, '../', audio.filePath));
        console.log("Audio deleted successfully:", audio);
        res.json({ message: "Audio deleted successfully" });
    } catch (err) {
        console.error("Error deleting audio:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
