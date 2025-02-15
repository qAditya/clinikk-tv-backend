const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Media = require('../models/mediaModel');
const authenticate = require('../config/auth');

const router = express.Router();
const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

router.post('/upload', authenticate, upload.single('media'), async (req, res) => {
    const { title } = req.body;
    const filePath = `/uploads/${req.file.filename}`;
    
    try {
        const media = new Media({ title, filePath });
        await media.save();
        res.json(media);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', authenticate, async (req, res) => {
    try {
        const media = await Media.find();
        res.json(media);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', authenticate, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) return res.status(404).json({ message: "Media not found" });

        res.sendFile(path.join(__dirname, '../', media.filePath));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
