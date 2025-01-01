// Büyüklüğe göre renk belirleme
function getQuakeColor(magnitude) {
    if (magnitude >= 7.0) return '#FF0000';     // Kırmızı
    if (magnitude >= 6.0) return '#FF4500';     // Turuncu-Kırmızı
    if (magnitude >= 5.0) return '#FFA500';     // Turuncu
    if (magnitude >= 4.0) return '#FFD700';     // Sarı
    if (magnitude >= 3.0) return '#90EE90';     // Açık Yeşil
    return '#98FB98';                           // Daha açık yeşil
}

// Son depremleri çek ve panele ekle
async function fetchRecentEarthquakes() {
    try {
        const response = await fetch('http://localhost:3000/api/earthquakes/latest?limit=40');
        const earthquakes = await response.json();
        
        const recentList = document.getElementById('recentEarthquakes');
        recentList.innerHTML = earthquakes.map(eq => `
            <div class="earthquake-item">
                <div class="earthquake-title">
                    <span class="magnitude" style="background-color: ${getQuakeColor(eq.magnitude)}">${eq.magnitude}</span>
                    ${eq.yer}
                </div>
                <div class="earthquake-details">
                    Tarih: ${eq.tarih} Saat: ${eq.saat}
                    <br>
                    Derinlik: ${eq.derinlik} km
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Son depremler yüklenirken hata:', error);
    }
}

// Büyük depremleri çek ve panele ekle
async function fetchMajorEarthquakes() {
    try {
        const response = await fetch('http://localhost:3000/api/earthquakes/magnitude');
        const earthquakes = await response.json();
        
        const majorList = document.getElementById('majorEarthquakes');
        majorList.innerHTML = earthquakes.map(eq => `
            <div class="earthquake-item major">
                <div class="earthquake-title">
                    <span class="magnitude" style="background-color: ${getQuakeColor(eq.magnitude)}">${eq.magnitude}</span>
                    ${eq.yer}
                </div>
                <div class="earthquake-details">
                    Tarih: ${eq.tarih} Saat: ${eq.saat}
                    <br>
                    Derinlik: ${eq.derinlik} km
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Büyük depremler yüklenirken hata:', error);
    }
}

// Sayfa yüklendiğinde panelleri başlat
document.addEventListener('DOMContentLoaded', () => {
    fetchRecentEarthquakes();
    fetchMajorEarthquakes();
    
    // Her 30 saniyede bir güncelle
    setInterval(() => {
        fetchRecentEarthquakes();
        fetchMajorEarthquakes();
    }, 30000);

    // Tema değişimi için
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    // Sayfa yüklendiğinde mevcut temayı uygula
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
            // Haritayı karanlık moda al
            if (window.map && window.updateMapTheme) {
                window.updateMapTheme('dark');
            }
        }
    }

    function switchTheme(e) {
        const theme = e.target.checked ? 'dark' : 'light';
        
        // Panel temasını değiştir
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Harita temasını değiştir
        if (window.map && window.updateMapTheme) {
            window.updateMapTheme(theme);
        }
    }

    toggleSwitch.addEventListener('change', switchTheme);
});