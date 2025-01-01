const express = require('express');
const cors = require('cors');
const { connectDB } = require('../config/database');

const app = express();

// CORS middleware
app.use(cors());
app.use(express.json());

// Veritabanı bağlantısı
connectDB();

// Routes
app.use('/api/earthquakes', require('../routes/api'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});