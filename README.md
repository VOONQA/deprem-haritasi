# Deprem Haritası Projesi

Bu proje, Türkiye'deki depremleri harita üzerinde görselleştiren bir web uygulamasıdır.

## Gereksinimler

- Docker Desktop
- SQL Server Management Studio (SSMS)
- Git
## Kurulum Adımları

### 1. Projeyi İndirme
-git clone https://github.com/kullaniciadin/deprem-haritasi.git
### 2. Portainer Kurulumu ve SQL Server Container Oluşturma

1. Portainer'ı kurun ve başlatın:
-docker volume create portainer_data

-----docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest

3. Portainer'a erişin:
   - https://localhost:9443 adresine gidin
   - İlk kullanımda admin hesabı oluşturun

4. SQL Server container'ı oluşturun:
   - Portainer'da "Containers" sekmesine gidin
   - "Add Container" butonuna tıklayın
   - Aşağıdaki bilgileri girin:
     - Name: sqlserver
     - Image: mcr.microsoft.com/mssql/server:2019-latest
     - Port mapping: 1434:1433
     - Env variables:
       ```
       ACCEPT_EULA: Y
       SA_PASSWORD: KendiSifreniz
       ```
   - "Deploy the container" butonuna tıklayın

### 3. Veritabanı Kurulumu

1. SQL Server Management Studio'yu açın ve sunucuya bağlanın:
   - Server name: localhost,1434
   - Authentication: SQL Server Authentication
   - Login: sa
   - Password: KendiSifreniz (Container oluştururken belirlediğiniz şifre)

2. Veritabanını Restore Etme:
   - Databases'e sağ tıklayın
   - "Restore Database" seçin
   - Device'ı seçin
   - Browse -> database/deprem_backup.bak dosyasını seçin
   - OK'a tıklayın

### 4. Proje Ayarları

1. Backend klasöründe config/database.js dosyasını düzenleyin:
 const config = {
server: 'host.docker.internal',
port: 1434,
database: 'DepremDBB',
user: 'sa',
password: 'KendiSifreniz', // SQL Server şifrenizi buraya yazın
options: {
encrypt: false,
trustServerCertificate: true
}
};                                                                                                                                                                                                                   ### 5. Docker Containerları Başlatma
         docker-compose up --build

### 6. Uygulamaya Erişim

### 6. Uygulamaya Erişim

- Frontend: http://localhost:1234
- Backend: http://localhost:5000
- Portainer: https://localhost:9443
- depremapi:http://localhost:3000/api/earthquakes - Tüm depremler, http://localhost:3000/api/earthquakes/latest?limit=40 - Son 40 deprem, http://localhost:3000/api/earthquakes/magnitude - Büyüklüğü 4\'ün üzerinde olan depremler


## Notlar

- SQL Server 1434 portunda çalışmaktadır
- Kendi SQL Server şifrenizi belirlemeyi unutmayın
- database/deprem_backup.bak dosyası veritabanı yedeğini içerir

## Olası Hatalar ve Çözümleri

1. SQL Server bağlantı hatası:
   - Portainer'dan container'ın çalıştığını kontrol edin
   - Şifrenizi doğru girdiğinizden emin olun
   - Port çakışması varsa farklı port kullanın

2. Veritabanı restore hatası:
   - Backup dosyasının doğru konumda olduğunu kontrol edin
   - SQL Server'ın yazma izinlerini kontrol edin

3. Portainer erişim hatası:
   - Docker Desktop'ın çalıştığından emin olun
   - 9443 portunun kullanılabilir olduğunu kontrol edin

      
