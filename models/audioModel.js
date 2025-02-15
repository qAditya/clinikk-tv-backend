const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    filePath: { type: String, required: true },
    tags: [{ type: String, required: true }]
});

module.exports = mongoose.model('Audio', audioSchema);
