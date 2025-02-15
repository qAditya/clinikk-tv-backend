const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    filePath: { type: String, required: true }
});

module.exports = mongoose.model('Media', mediaSchema);
