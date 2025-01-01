// Harita başlangıç ayarları
let map;
let currentZoomLevel = 6;
let currentTheme = 'light';
let currentLayer = 'streets';

// Harita katmanlarını tanımla
let mapLayers = {
    streets: {
        light: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        dark: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        })
    },
    satellite: {
        light: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
        }),
        dark: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
        })
    },
    terrain: {
        light: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
        }),
        dark: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        })
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Türkiye'nin merkez koordinatları
    const turkeyCenter = [39.0, 35.0];
    
    // Haritayı başlat
    map = L.map('map', {
        center: turkeyCenter,
        zoom: 6,
        minZoom: 3,
        maxZoom: 18
    });

    // Başlangıç temasını kontrol et
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;

    // Varsayılan katmanı ekle
    mapLayers[currentLayer][currentTheme].addTo(map);

    // Diğer event listener'lar...
    map.on('zoomstart', function() {
        currentZoomLevel = map.getZoom();
    });

    map.on('zoomend', function() {
        const newZoom = map.getZoom();
        updateCircles(newZoom);
    });

    loadCurrentEarthquakes();
    startDataUpdates();
});

// Harita tipini değiştirme fonksiyonu
window.changeMapType = function(type) {
    if (currentLayer === type) return;
    
    // Önceki katmanı kaldır
    map.removeLayer(mapLayers[currentLayer][currentTheme]);
    
    // Yeni katmanı ekle
    map.addLayer(mapLayers[type][currentTheme]);
    currentLayer = type;
    
    // Buton stillerini güncelle
    document.querySelectorAll('.map-type-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`button[onclick="changeMapType('${type}')"]`).classList.add('active');
};

// Tema değişim fonksiyonunu global scope'a taşı
window.updateMapTheme = function(theme) {
    if (currentTheme === theme) return;
    
    // Önceki katmanı kaldır
    map.removeLayer(mapLayers[currentLayer][currentTheme]);
    
    // Yeni katmanı ekle
    currentTheme = theme;
    map.addLayer(mapLayers[currentLayer][currentTheme]);
};

// Büyüklüğe göre renk belirleme
function getQuakeColor(magnitude) {
    if (magnitude >= 7.0) return '#FF0000';
    if (magnitude >= 6.0) return '#FF4500';
    if (magnitude >= 5.0) return '#FFA500';
    if (magnitude >= 4.0) return '#FFD700';
    if (magnitude >= 3.0) return '#90EE90';
    return '#98FB98';
}

// Zoom seviyesine göre daire yarıçapı ayarı
function getQuakeRadius(magnitude, zoomLevel) {
    const baseSize = 2500;
    let magnitudeFactor;
    
    if (magnitude >= 7.0) magnitudeFactor = 2.5;
    else if (magnitude >= 6.0) magnitudeFactor = 2.0;
    else if (magnitude >= 5.0) magnitudeFactor = 1.5;
    else magnitudeFactor = 1.0;
    
    return baseSize * magnitude * magnitudeFactor * Math.pow(0.5, zoomLevel - 6);
}

// Daireleri güncelle
function updateCircles(newZoom) {
    map.eachLayer((layer) => {
        if (layer instanceof L.Circle) {
            const popupContent = layer.getPopup().getContent();
            const magnitudeMatch = popupContent.match(/Büyüklük:<\/strong> ([\d.]+)/);
            const magnitude = magnitudeMatch ? parseFloat(magnitudeMatch[1]) : 3.0;
            
            const newRadius = getQuakeRadius(magnitude, newZoom);
            layer.setRadius(newRadius);
        }
    });
}

// Güncel depremleri haritaya ekle
async function loadCurrentEarthquakes() {
    try {
        const response = await fetch('http://localhost:3000/api/earthquakes');
        const earthquakes = await response.json();

        map.eachLayer((layer) => {
            if (layer instanceof L.Circle) {
                map.removeLayer(layer);
            }
        });

        earthquakes.forEach(quake => {
            const lat = parseFloat(quake.enlem);
            const lng = parseFloat(quake.boylam);
            const magnitude = parseFloat(quake.magnitude);

            if (isNaN(lat) || isNaN(lng)) return;
            if (magnitude < 2.5) return;

            const circle = L.circle([lat, lng], {
                color: getQuakeColor(magnitude),
                fillColor: getQuakeColor(magnitude),
                fillOpacity: 0.35,
                weight: 1,
                radius: getQuakeRadius(magnitude, map.getZoom()),
                zIndexOffset: magnitude >= 5 ? 1000 : Math.floor(magnitude * 100)
            }).addTo(map);

            circle.bindPopup(`
                <div class="popup-content">
                    <h3>Deprem Bilgileri</h3>
                    <p><strong>Büyüklük:</strong> ${magnitude.toFixed(1)}</p>
                    <p><strong>Tarih:</strong> ${quake.tarih}</p>
                    <p><strong>Saat:</strong> ${quake.saat}</p>
                    <p><strong>Derinlik:</strong> ${quake.derinlik} km</p>
                    <p><strong>Yer:</strong> ${quake.yer}</p>
                </div>
            `);
        });
    } catch (error) {
        console.error('Güncel deprem verileri yüklenirken hata:', error);
    }
}


// Global scope'da fonksiyonları tanımla
window.showCurrent = function() {
    document.querySelector('.map-button.active').classList.remove('active');
    document.querySelector('button[onclick="showCurrent()"]').classList.add('active');
    loadCurrentEarthquakes();
}

window.show2023 = function() {
    document.querySelector('.map-button.active').classList.remove('active');
    document.querySelector('button[onclick="show2023()"]').classList.add('active');
    loadYearEarthquakes(2023);
}

// Yıla göre deprem gösterme fonksiyonu
async function loadYearEarthquakes(year) {
    try {
        const response = await fetch(`http://localhost:5000/api/earthquakes/year/${year}`);
        const earthquakes = await response.json();

        // Mevcut daireleri temizle
        map.eachLayer((layer) => {
            if (layer instanceof L.Circle) {
                map.removeLayer(layer);
            }
        });

        // Depremleri büyüklüklerine göre KÜÇÜKTEN BÜYÜĞE sırala
        // Böylece büyük depremler en son çizilecek ve üstte görünecek
        earthquakes.sort((a, b) => parseFloat(a.Magnitude) - parseFloat(b.Magnitude));

        // Mevcut zoom seviyesini al
        const currentZoom = map.getZoom();

        earthquakes.forEach(quake => {
            const lat = parseFloat(quake.Enlem);
            const lng = parseFloat(quake.Boylam);
            const magnitude = parseFloat(quake.Magnitude);

            if (isNaN(lat) || isNaN(lng)) return;
            if (magnitude < 2.5) return;

            // Tarih ve saat formatını düzelt
            const tarihObj = new Date(quake.OlusTarihi);
            const tarih = tarihObj.toISOString().split('T')[0];
            const saat = quake.OlusZamani ? quake.OlusZamani.split('T')[1].split('.')[0] : '';

            const circle = L.circle([lat, lng], {
                color: getQuakeColor(magnitude),
                fillColor: getQuakeColor(magnitude),
                fillOpacity: 0.35,
                weight: 1,
                radius: getQuakeRadius(magnitude, currentZoom),
                zIndex: Math.floor(magnitude * 1000) // Büyük depremlere daha yüksek z-index
            }).addTo(map);

            circle.bindPopup(`
                <div class="popup-content">
                    <h3>Deprem Bilgileri</h3>
                    <p><strong>Büyüklük:</strong> ${magnitude}</p>
                    <p><strong>Tarih:</strong> ${tarih}</p>
                    <p><strong>Saat:</strong> ${saat}</p>
                    <p><strong>Derinlik:</strong> ${quake.Derinlik} km</p>
                    <p><strong>Yer:</strong> ${quake.Yer || 'Bilinmiyor'}</p>
                </div>
            `);
        });

    } catch (error) {
        console.error(`${year} deprem verileri yüklenirken hata:`, error);
    }
}

// Yıl butonları için event handler'lar
window.show2022 = function() {
    document.querySelector('.map-button.active').classList.remove('active');
    document.querySelector('button[onclick="show2022()"]').classList.add('active');
    loadYearEarthquakes(2022);
}

window.show2021 = function() {
    document.querySelector('.map-button.active').classList.remove('active');
    document.querySelector('button[onclick="show2021()"]').classList.add('active');
    loadYearEarthquakes(2021);
}

window.show2020 = function() {
    document.querySelector('.map-button.active').classList.remove('active');
    document.querySelector('button[onclick="show2020()"]').classList.add('active');
    loadYearEarthquakes(2020);
}