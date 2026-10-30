
class MapManager {
  constructor() {
    this.formMap = null;
    this.formMarker = null;
    this.transparencyMap = null;
    this.transparencyMarkersLayer = null;
    this.officerMap = null;
    this.officerMarkersLayer = null;

    // Tile Layer: OpenStreetMap with crisp modern rendering
    this.tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.tileAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  }

  // Create custom colored HTML markers for Leaflet
  createCustomIcon(category, status = 'Selesai') {
    let colorClass = 'marker-blue';
    let iconSymbol = '📍';

    switch (category) {
      case 'Jalan':
        colorClass = 'marker-orange';
        iconSymbol = '🛣️';
        break;
      case 'Lampu':
        colorClass = 'marker-yellow';
        iconSymbol = '💡';
        break;
      case 'Drainase':
        colorClass = 'marker-cyan';
        iconSymbol = '💧';
        break;
      case 'Fasilitas':
        colorClass = 'marker-green';
        iconSymbol = '🏫';
        break;
      default:
        colorClass = 'marker-purple';
        iconSymbol = '🗑️';
    }

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="marker-pin ${colorClass}">
          <span class="marker-icon">${iconSymbol}</span>
        </div>
        <div class="marker-pulse ${colorClass}"></div>
      `,
      iconSize: [36, 42],
      iconAnchor: [18, 42],
      popupAnchor: [0, -38]
    });
  }

  /**
   * 1. Halaman Buat Laporan - Peta Pemilih Lokasi (Form Picker)
   */
  initFormMap(containerId = 'report-form-map', defaultCoords = [-6.1895, 106.8322], onCoordsChanged = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.formMap) {
      this.formMap.remove();
      this.formMap = null;
    }

    this.formMap = L.map(containerId, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView(defaultCoords, 14);

    L.tileLayer(this.tileUrl, {
      attribution: this.tileAttrib,
      maxZoom: 19
    }).addTo(this.formMap);

    const icon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="marker-pin marker-red">
          <span class="marker-icon">📌</span>
        </div>
      `,
      iconSize: [36, 42],
      iconAnchor: [18, 42]
    });

    this.formMarker = L.marker(defaultCoords, {
      draggable: true,
      icon: icon
    }).addTo(this.formMap);

    // Event on drag end
    this.formMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      if (onCoordsChanged) onCoordsChanged(pos.lat, pos.lng);
    });

    // Event on map click
    this.formMap.on('click', (e) => {
      const pos = e.latlng;
      this.formMarker.setLatLng(pos);
      if (onCoordsChanged) onCoordsChanged(pos.lat, pos.lng);
    });

    setTimeout(() => {
      if (this.formMap) this.formMap.invalidateSize();
    }, 250);
  }

  setFormMarkerPosition(lat, lng) {
    if (this.formMarker && this.formMap) {
      const pos = L.latLng(lat, lng);
      this.formMarker.setLatLng(pos);
      this.formMap.panTo(pos);
    }
  }

  /**
   * 2. Halaman Data & Transparansi - Peta Sebaran Masalah Nasional / Kota
   */
  initTransparencyMap(containerId = 'transparency-map', selectedCategory = 'all') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.transparencyMap) {
      this.transparencyMap.remove();
      this.transparencyMap = null;
    }

    // Default view centered on Indonesia / Jakarta
    this.transparencyMap = L.map(containerId, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([-6.2088, 106.8456], 11);

    L.tileLayer(this.tileUrl, {
      attribution: this.tileAttrib,
      maxZoom: 19
    }).addTo(this.transparencyMap);

    this.transparencyMarkersLayer = L.layerGroup().addTo(this.transparencyMap);
    this.renderTransparencyMarkers(selectedCategory);

    setTimeout(() => {
      if (this.transparencyMap) this.transparencyMap.invalidateSize();
    }, 300);
  }

  renderTransparencyMarkers(filterCategory = 'all') {
    if (!this.transparencyMap || !this.transparencyMarkersLayer) return;

    this.transparencyMarkersLayer.clearLayers();
    const reports = window.dataStore.getReports();

    reports.forEach((report) => {
      if (filterCategory !== 'all' && report.category !== filterCategory) return;
      if (!report.coords || report.coords.length < 2) return;

      const marker = L.marker(report.coords, {
        icon: this.createCustomIcon(report.category, report.status)
      });

      const popupHtml = `
        <div class="map-popup-card">
          <div class="popup-thumb" style="background-image: url('${report.photoBefore}');">
            <span class="popup-badge ${report.statusBadge}">${report.status}</span>
          </div>
          <div class="popup-content">
            <span class="popup-ticket">${report.ticketCode}</span>
            <h4 class="popup-title">${report.title}</h4>
            <p class="popup-loc"><i class="fa-solid fa-location-dot"></i> ${report.location}</p>
            <div class="popup-action">
              <button class="btn btn-xs btn-primary" onclick="app.showReportDetail('${report.ticketCode}')">
                Lihat Detail & Bukti
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280, className: 'custom-leaflet-popup' });
      this.transparencyMarkersLayer.addLayer(marker);
    });
  }

  /**
   * 3. Halaman Dashboard Instansi - Peta Tugas Lapangan
   */
  initOfficerTaskMap(containerId = 'officer-task-map') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.officerMap) {
      this.officerMap.remove();
      this.officerMap = null;
    }

    this.officerMap = L.map(containerId, {
      zoomControl: false,
      attributionControl: false
    }).setView([-6.1895, 106.8322], 12);

    L.tileLayer(this.tileUrl, { maxZoom: 18 }).addTo(this.officerMap);
    this.officerMarkersLayer = L.layerGroup().addTo(this.officerMap);

    const reports = window.dataStore.getReports();
    reports.slice(0, 5).forEach((report) => {
      if (!report.coords) return;
      const marker = L.marker(report.coords, {
        icon: this.createCustomIcon(report.category, report.status)
      });
      marker.bindPopup(`<b>${report.ticketCode}</b><br>${report.title}`);
      this.officerMarkersLayer.addLayer(marker);
    });

    setTimeout(() => {
      if (this.officerMap) this.officerMap.invalidateSize();
    }, 250);
  }
}

// Global Map Manager instance
window.mapManager = new MapManager();
