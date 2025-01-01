const { sql } = require('../config/database');

const Earthquake = {
    // 2.5 ve üzeri depremleri getir
    getAllEarthquakes: async () => {
        try {
            const result = await sql.query`
                SELECT 
                    DepremKodu,
                    OlusTarihi,
                    OlusZamani,
                    Enlem,
                    Boylam,
                    Derinlik,
                    ML as Magnitude,
                    Yer
                FROM dbo.DepremVerileri
                WHERE ML >= 2.5
                ORDER BY OlusTarihi DESC, OlusZamani DESC
            `;
            return result.recordset;
        } catch (error) {
            console.error('Deprem verileri çekilirken hata:', error);
            throw error;
        }
    },

    // Belirli büyüklükteki depremleri getir
    getEarthquakesByMagnitude: async (minMagnitude = 2.5) => {
        try {
            const result = await sql.query`
                SELECT 
                    DepremKodu,
                    OlusTarihi,
                    OlusZamani,
                    Enlem,
                    Boylam,
                    Derinlik,
                    ML as Magnitude,
                    Yer
                FROM dbo.DepremVerileri
                WHERE ML >= ${minMagnitude}
                ORDER BY OlusTarihi DESC, OlusZamani DESC
            `;
            return result.recordset;
        } catch (error) {
            console.error('Deprem verileri çekilirken hata:', error);
            throw error;
        }
    }
};

module.exports = Earthquake;