const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/videoModel');
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

router.post('/upload', authenticate, upload.single('video'), async (req, res) => {
    console.log("Upload request received"); 
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const { title, tags } = req.body;
    const filePath = `/uploads/${req.file.filename}`;
    console.log("File path:", filePath); 
    
    try {
        const video = new Video({ title, filePath, tags: tags.split(',') });
        await video.save();
        console.log("Video saved successfully:", video); 
        res.json(video);
    } catch (err) {
        console.error("Error saving video:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        const tags = [];
        if (user.healthData.diabetes) tags.push('diabetes');
        if (user.healthData.age > 50) tags.push('age_50_plus');
        const videos = await Video.find({ tags: { $in: tags } });
        res.json(videos);
    } catch (err) {
        console.error("Error fetching videos:", err); 
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    console.log("Delete request received for video ID:", req.params.id); 
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
    }
    try {
        const video = await Video.findByIdAndDelete(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        fs.unlinkSync(path.join(__dirname, '../', video.filePath));
        console.log("Video deleted successfully:", video); 
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        console.error("Error deleting video:", err); 
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
