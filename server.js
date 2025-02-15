require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('./config/db');
const mediaRoutes = require('./routes/mediaRoutes');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const audioRoutes = require('./routes/audioRoutes');

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("MongoDB URI is missing!");
    process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/media', mediaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/audios', audioRoutes);
app.get("/", (req, res) => {
    res.send("Clinikk TV Backend is running!");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));