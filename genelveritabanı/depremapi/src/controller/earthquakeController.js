const express = require('express');
const router = express.Router();
const earthquakeService = require('../services/earthquakeService');

// Endpoint'leri konsola yazdır
console.log('\nAPI Endpoints:');
console.log('GET http://localhost:3000/api/earthquakes - Tüm depremler');
console.log('GET http://localhost:3000/api/earthquakes/latest?limit=40 - Son 40 deprem');
console.log('GET http://localhost:3000/api/earthquakes/magnitude - Büyüklüğü 4\'ün üzerinde olan depremler\n');

router.get('/', async (req, res) => {
    try {
        const earthquakes = await earthquakeService.getAllEarthquakes();
        res.json(earthquakes);
    } catch (error) {
        res.status(500).json({ error: 'Veriler alınırken bir hata oluştu' });
    }
});

router.get('/latest', async (req, res) => {
    try {
        const limit = 40; // Sabit 40 deprem
        const earthquakes = await earthquakeService.getLatestEarthquakes(limit);
        res.json(earthquakes);
    } catch (error) {
        res.status(500).json({ error: 'Veriler alınırken bir hata oluştu' });
    }
});

router.get('/magnitude', async (req, res) => {
    try {
        const earthquakes = await earthquakeService.getMagnitudeAboveFour();
        res.json(earthquakes);
    } catch (error) {
        res.status(500).json({ error: 'Veriler alınırken bir hata oluştu' });
    }
});

router.get('/:id', (req, res) => {
    const earthquake = earthquakeService.getEarthquakeById(req.params.id);
    if (!earthquake) {
        return res.status(404).json({ message: 'Deprem bulunamadı' });
    }
    res.json(earthquake);
});

module.exports = router;