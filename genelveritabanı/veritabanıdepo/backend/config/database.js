const sql = require('mssql');

const config = {
    server: 'host.docker.internal',  // Docker'dan localhost'a erişim
    port: 1434,                      // Port numarası
    database: 'DepremDBB',
    user: 'sa',                      // SQL Authentication
    password: 'talha2314',           // SA şifresi
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

const connectDB = async () => {
    try {
        console.log('Veritabanına bağlanmaya çalışılıyor...');
        await sql.connect(config);
        console.log('SQL Server bağlantısı başarılı');
    } catch (error) {
        console.error('SQL Server bağlantı hatası:', error.message);
        console.error('Hata detayı:', error);
        process.exit(1);
    }
};

module.exports = { sql, connectDB };