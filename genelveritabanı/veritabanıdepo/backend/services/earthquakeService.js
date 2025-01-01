const { sql } = require('../config/database');

const earthquakeService = {
    // Güncel depremleri getir
    getCurrentEarthquakes: async () => {
        try {
            const result = await sql.query`
                SELECT TOP 100
                    DepremKodu,
                    OlusTarihi,
                    OlusZamani,
                    Enlem,
                    Boylam,
                    Derinlik,
                    ML as Magnitude,
                    Yer
                FROM dbo.DepremVerileri
                WHERE ML IS NOT NULL
                ORDER BY OlusTarihi DESC, OlusZamani DESC
            `;
            return result.recordset;
        } catch (error) {
            console.error('Deprem verileri çekilirken hata:', error);
            throw error;
        }
    },

    // Yıla göre depremleri getir
    getEarthquakesByYear: async (year) => {
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
                WHERE YEAR(OlusTarihi) = ${year}
                AND ML IS NOT NULL
                ORDER BY ML DESC, OlusTarihi DESC
            `;
            return result.recordset;
        } catch (error) {
            console.error(`${year} yılı deprem verileri çekilirken hata:`, error);
            throw error;
        }
    },

    // Büyük depremleri getir (ML >= 4.0)
    
};

module.exports = earthquakeService;