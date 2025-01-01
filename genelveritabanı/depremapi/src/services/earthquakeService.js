const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const dataFilePath = path.join(__dirname, '../data/earthquakes.json');

async function fetchKandilliData() {
    try {
        const response = await axios.get('http://www.koeri.boun.edu.tr/scripts/lst0.asp');
        const html = response.data;
        const $ = cheerio.load(html);
        
        const text = $('pre').text();
        const lines = text.split('\n');
        
        const earthquakes = lines.slice(6)
            .filter(line => line.trim().length > 0)
            .map((line, index) => {
                const parts = line.trim().split(/\s+/);
                
                // Location'dan ilksel ifadesini kaldır
                let location = parts.slice(8).join(' ')
                    .replace(/\s*\�lksel\s*/, '')
                    .trim();
                
                return {
                    id: (index + 1).toString(),
                    magnitude: parseFloat(parts[6]).toFixed(1),
                    tarih: parts[0],
                    saat: parts[1],
                    derinlik: parseFloat(parts[4]),
                    yer: location,
                    enlem: parseFloat(parts[2]),
                    boylam: parseFloat(parts[3])
                };
            });

        fs.writeFileSync(dataFilePath, JSON.stringify(earthquakes, null, 2));
        console.log(`${new Date().toLocaleTimeString()} - Veriler güncellendi (${earthquakes.length} deprem)`);
        
        return earthquakes;
    } catch (error) {
        console.error('Veri çekilirken hata oluştu:', error);
        return [];
    }
}
setInterval(fetchKandilliData, 20000);
fetchKandilliData();

async function getAllEarthquakes() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function getLatestEarthquakes(limit) {
    const earthquakes = await getAllEarthquakes();
    return earthquakes.slice(0, limit);
}

// 4'ün üzerindeki depremleri getir
async function getMagnitudeAboveFour() {
    const earthquakes = await getAllEarthquakes();
    return earthquakes.filter(eq => eq.magnitude > 4);
}

function getEarthquakeById(id) {
    try {
        const earthquakes = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
        return earthquakes.find(eq => eq.id === id);
    } catch (error) {
        return null;
    }
}

module.exports = {
    getAllEarthquakes,
    getLatestEarthquakes,
    getMagnitudeAboveFour,
    getEarthquakeById
};