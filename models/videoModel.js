const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    filePath: { type: String, required: true },
    tags: [{ type: String, required: true }]
});

module.exports = mongoose.model('Video', videoSchema);
