/**
 * charts.js - Chart.js Visualizations for InfrastrukturKu
 * Visualisasi Statistik, Tren Laporan, dan Transparansi Penanganan
 */

class ChartManager {
  constructor() {
    this.dashboardBarChart = null;
    this.statusDoughnutChart = null;
    this.trendLineChart = null;
    this.officerPerfChart = null;
  }

  /**
   * 1. Dashboard Utama: Grafik Laporan per Kategori (Bar Chart)
   */
  initDashboardChart(canvasId = 'dashboard-report-chart', period = 'sebulan') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.dashboardBarChart) {
      this.dashboardBarChart.destroy();
      this.dashboardBarChart = null;
    }

    // Dynamic data according to period
    const datasets = {
      '7hari': [45, 28, 36, 19, 12],
      'sebulan': [3450, 2180, 2890, 1420, 980],
      '1tahun': [42100, 28400, 31200, 16800, 11400]
    };

    const dataValues = datasets[period] || datasets['sebulan'];

    this.dashboardBarChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Jalan', 'Lampu', 'Drainase', 'Fasilitas', 'Lainnya'],
        datasets: [{
          label: 'Jumlah Laporan',
          data: dataValues,
          backgroundColor: [
            'rgba(37, 99, 235, 0.85)',   // Royal Blue (Jalan)
            'rgba(245, 158, 11, 0.85)',  // Amber (Lampu)
            'rgba(14, 165, 233, 0.85)',  // Sky (Drainase)
            'rgba(16, 185, 129, 0.85)',  // Emerald (Fasilitas)
            'rgba(139, 92, 246, 0.85)'   // Purple (Lainnya)
          ],
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 38
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
            bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", weight: '500' } }
          },
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            ticks: {
              font: { family: "'Plus Jakarta Sans', sans-serif" },
              callback: (value) => value.toLocaleString('id-ID')
            }
          }
        }
      }
    });
  }

  initTransparencyCharts() {
    const doughnutCanvas = document.getElementById('transparency-status-chart');
    const trendCanvas = document.getElementById('transparency-trend-chart');

    // Status Doughnut Chart
    if (doughnutCanvas) {
      if (this.statusDoughnutChart) this.statusDoughnutChart.destroy();
      this.statusDoughnutChart = new Chart(doughnutCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Selesai (BuktiTuntas)', 'Dalam Proses', 'Tertunda / Menunggu'],
          datasets: [{
            data: [7421, 3842, 1165],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            hoverOffset: 6,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 14,
                font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 }
              }
            }
          },
          cutout: '72%'
        }
      });
    }

    // Tren Bulanan Line Chart
    if (trendCanvas) {
      if (this.trendLineChart) this.trendLineChart.destroy();
      this.trendLineChart = new Chart(trendCanvas, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'],
          datasets: [
            {
              label: 'Laporan Masuk',
              data: [820, 940, 1120, 1050, 1340, 1280, 1450, 1390, 1620, 1580],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              fill: true,
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: '#2563eb'
            },
            {
              label: 'Diselesaikan (BuktiTuntas)',
              data: [650, 810, 980, 950, 1210, 1190, 1370, 1310, 1510, 1490],
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              borderDash: [4, 4],
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: '#10b981'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { font: { family: "'Plus Jakarta Sans', sans-serif" } }
            }
          },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(226, 232, 240, 0.6)' } }
          }
        }
      });
    }
  }

  /**
   * 3. Dashboard Instansi: Kinerja Petugas / Kategori
   */
  initOfficerCharts() {
    const canvas = document.getElementById('officer-performance-chart');
    if (!canvas) return;

    if (this.officerPerfChart) this.officerPerfChart.destroy();

    this.officerPerfChart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['Kecepatan Respon', 'Bukti Valid', 'Penyelesaian Teknis', 'Kepuasan Warga', 'Kepatuhan SOP'],
        datasets: [{
          label: 'Indeks Kinerja Satgas PU',
          data: [92, 96, 88, 95, 90],
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: '#2563eb',
          pointBackgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 50,
            max: 100,
            ticks: { stepSize: 10, display: false }
          }
        }
      }
    });
  }
}

// Global Chart Manager instance
window.chartManager = new ChartManager();
