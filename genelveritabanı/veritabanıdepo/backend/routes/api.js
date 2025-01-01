const express = require('express');
const router = express.Router();
const Earthquake = require('../models/Earthquake');  // Model'i import ediyoruz
const earthquakeService = require('../services/earthquakeService');

// Tüm depremleri getir (2.5 ve üzeri)
router.get('/all', async (req, res) => {
    try {
        const earthquakes = await Earthquake.getAllEarthquakes();  // Earthquake modeli kullanılıyor
        res.json(earthquakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Belirli büyüklükteki depremleri getir
router.get('/magnitude/:min', async (req, res) => {
    try {
        const minMagnitude = parseFloat(req.params.min) || 2.5;
        const earthquakes = await Earthquake.getEarthquakesByMagnitude(minMagnitude);  // Earthquake modeli kullanılıyor
        res.json(earthquakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Yıla göre depremleri getir
router.get('/year/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const earthquakes = await earthquakeService.getEarthquakesByYear(year);
        res.json(earthquakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;