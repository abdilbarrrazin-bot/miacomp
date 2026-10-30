class App {
  constructor() {
    this.currentView = 'dashboard';
    this.selectedReportId = null;
    this.selectedReportTicket = null;
    this.activeFormCoords = [-6.1895, 106.8322];
    this.isOfficerMode = false;
    
    // Slider state for BuktiTuntas
    this.sliderPosition = 50;
    this.isDraggingSlider = false;

    // Report form uploaded photo preview
    this.uploadedBeforePhoto = null;
    this.officerUploadedAfterPhoto = null;

    this.init();
  }

  init() {
    // 1. Check user role and update UI
    this.syncCurrentUser();

    // 2. Setup hash routing
    window.addEventListener('hashchange', () => this.handleRouting());
    
    // 3. Initialize current view based on hash or default
    this.handleRouting();

    // 4. Global UI event listeners
    this.setupEventListeners();
  }

  syncCurrentUser() {
    const user = window.dataStore.getCurrentUser();
    this.isOfficerMode = (user.role === 'petugas');

    // Update sidebar profile card
    const nameEl = document.getElementById('user-profile-name');
    const roleEl = document.getElementById('user-profile-role');
    const avatarEl = document.getElementById('user-profile-avatar');
    const topAvatarEl = document.getElementById('topbar-avatar');
    const rolePill = document.getElementById('topbar-role-pill');
    const roleBadge = document.getElementById('current-role-badge');

    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.roleLabel || (this.isOfficerMode ? 'Petugas Dinas PU' : 'Masyarakat');
    if (avatarEl) avatarEl.src = user.avatar;
    if (topAvatarEl) topAvatarEl.src = user.avatar;
    if (rolePill) {
      rolePill.textContent = this.isOfficerMode ? 'Mode Petugas PU' : 'Mode Warga';
      rolePill.className = `role-pill ${this.isOfficerMode ? 'role-officer' : 'role-citizen'}`;
    }
    if (roleBadge) {
      roleBadge.textContent = this.isOfficerMode ? 'Petugas Dinas' : 'Warga';
      roleBadge.className = `badge ${this.isOfficerMode ? 'badge-primary' : 'badge-slate'}`;
    }

    // Toggle officer dashboard menu item in sidebar
    const instansiMenuItem = document.getElementById('nav-instansi');
    if (instansiMenuItem) {
      instansiMenuItem.style.display = this.isOfficerMode ? 'flex' : 'none';
    }
  }

  switchUserRole(targetRole = null) {
    const nextRole = targetRole || (this.isOfficerMode ? 'warga' : 'petugas');
    window.dataStore.switchRole(nextRole);
    this.syncCurrentUser();
    this.showToast(`Beralih ke akun ${nextRole === 'petugas' ? 'Petugas Dinas PU' : 'Masyarakat (Andi Pratama)'}`, 'info');

    if (nextRole === 'petugas') {
      this.navigate('dashboard-instansi');
    } else {
      this.navigate('dashboard');
    }
  }

  handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const [viewName, param] = hash.split('/');

    this.navigate(viewName, param);
  }

  navigate(viewName, param = null) {
    const validViews = [
      'auth', 'dashboard', 'laporan-form', 'daftar-laporan', 'detail-laporan',
      'pengaduan', 'perizinan', 'bansos', 'transparansi', 'lacak-publik',
      'dashboard-instansi', 'profil'
    ];

    if (!validViews.includes(viewName)) {
      viewName = 'dashboard';
    }

    this.currentView = viewName;

    // Handle view visibility
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetViewEl = document.getElementById(`view-${viewName}`);
    if (targetViewEl) {
      targetViewEl.classList.add('active');
    }

    // Toggle full-screen layout for Auth & Public Lacak
    const appShell = document.querySelector('.app-layout');
    const isFullScreen = (viewName === 'auth' || viewName === 'lacak-publik');

    if (appShell) {
      if (isFullScreen) {
        appShell.classList.add('full-screen-mode');
      } else {
        appShell.classList.remove('full-screen-mode');
      }
    }

    // Highlight sidebar active link
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.view === viewName) {
        item.classList.add('active');
      }
    });

    // Close mobile sidebar if open
    this.closeSidebar();

    // Trigger View-specific lifecycle hooks
    this.onViewActivated(viewName, param);
  }

  onViewActivated(viewName, param) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (viewName) {
      case 'dashboard':
        this.renderDashboard();
        break;

      case 'laporan-form':
        this.renderReportForm();
        break;

      case 'daftar-laporan':
        this.renderReportsList();
        break;

      case 'detail-laporan':
        const ticketCode = param || this.selectedReportTicket || 'INF-2025-0012';
        this.renderReportDetail(ticketCode);
        break;

      case 'pengaduan':
        this.renderComplaints();
        break;

      case 'perizinan':
        this.renderPermits();
        break;

      case 'bansos':
        this.renderBansos();
        break;

      case 'transparansi':
        this.renderTransparency();
        break;

      case 'dashboard-instansi':
        this.renderOfficerDashboard();
        break;

      case 'profil':
        this.renderProfile();
        break;

      case 'lacak-publik':
        if (param) {
          const input = document.getElementById('public-search-input');
          if (input) input.value = param;
          this.searchPublicTicket(param);
        }
        break;
    }
  }

  setupEventListeners() {
    // 1. Mobile Sidebar Toggle
    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    const sidebarCloseBtn = document.getElementById('btn-sidebar-close');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => this.openSidebar());
    }
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', () => this.closeSidebar());
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => this.closeSidebar());
    }

    // 2. Global Search Bar in Topbar
    const globalSearchInput = document.getElementById('topbar-search-input');
    if (globalSearchInput) {
      globalSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const val = globalSearchInput.value.trim();
          if (val) {
            if (val.toUpperCase().startsWith('INF-') || val.toUpperCase().startsWith('PGD-') || val.toUpperCase().startsWith('IZN-')) {
              this.showReportDetail(val);
            } else {
              window.location.hash = '#daftar-laporan';
              setTimeout(() => {
                const searchEl = document.getElementById('reports-search-input');
                if (searchEl) {
                  searchEl.value = val;
                  this.filterReportsList();
                }
              }, 100);
            }
          }
        }
      });
    }

    // 3. Setup BuktiTuntas Before/After Slider Dragging
    this.setupBuktiTuntasSlider();
  }

  openSidebar() {
    const sidebar = document.querySelector('.app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
  }

  closeSidebar() {
    const sidebar = document.querySelector('.app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type} animate-slide-in`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'error') icon = 'fa-circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* LOGIN & REGISTER */
  switchAuthTab(tabName) {
    const loginTabBtn = document.getElementById('tab-btn-login');
    const registerTabBtn = document.getElementById('tab-btn-register');
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');

    if (tabName === 'login') {
      if (loginTabBtn) loginTabBtn.classList.add('active');
      if (registerTabBtn) registerTabBtn.classList.remove('active');
      if (loginForm) loginForm.style.display = 'block';
      if (registerForm) registerForm.style.display = 'none';
    } else {
      if (registerTabBtn) registerTabBtn.classList.add('active');
      if (loginTabBtn) loginTabBtn.classList.remove('active');
      if (loginForm) loginForm.style.display = 'none';
      if (registerForm) registerForm.style.display = 'block';
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    window.supabaseService.signIn(email, password).then(({ user }) => {
      this.syncCurrentUser();
      this.showToast(`Selamat datang kembali, ${user.name}!`, 'success');
      this.navigate(user.role === 'petugas' ? 'dashboard-instansi' : 'dashboard');
    });
  }

  handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    window.supabaseService.signUp(email, password, name).then(({ user }) => {
      this.syncCurrentUser();
      this.showToast(`Pendaftaran berhasil! Selamat datang, ${name}.`, 'success');
      this.navigate('dashboard');
    });
  }

  quickDemoLogin(role) {
    this.switchUserRole(role);
  }

  logout() {
    window.supabaseService.signOut().then(() => {
      this.showToast('Anda telah keluar dari akun.', 'info');
      this.navigate('auth');
    });
  }

  /* DASHBOARD UTAMA (MASYARAKAT) */
  renderDashboard() {
    const stats = window.dataStore.getStatistics();
    
    // Update Stat Cards
    const elTotal = document.getElementById('stat-total-laporan');
    const elProses = document.getElementById('stat-dalam-proses');
    const elSelesai = document.getElementById('stat-selesai');
    const elTertunda = document.getElementById('stat-tertunda');

    if (elTotal) elTotal.textContent = stats.total.toLocaleString('id-ID');
    if (elProses) elProses.textContent = stats.dalamProses.toLocaleString('id-ID');
    if (elSelesai) elSelesai.textContent = stats.selesai.toLocaleString('id-ID');
    if (elTertunda) elTertunda.textContent = stats.tertunda.toLocaleString('id-ID');

    // Render Recent Reports List
    const recentContainer = document.getElementById('dashboard-recent-reports');
    if (recentContainer) {
      const reports = window.dataStore.getReports().slice(0, 4);
      recentContainer.innerHTML = reports.map(r => `
        <div class="recent-report-card" onclick="app.showReportDetail('${r.ticketCode}')">
          <div class="recent-report-thumb" style="background-image: url('${r.photoBefore}');"></div>
          <div class="recent-report-body">
            <h4 class="recent-report-title">${r.title}</h4>
            <div class="recent-report-meta">
              <span><i class="fa-solid fa-location-dot"></i> ${r.city}</span>
              <span>&bull;</span>
              <span>${this.formatTimeAgo(r.createdAt)}</span>
            </div>
          </div>
          <div class="recent-report-status">
            <span class="badge ${r.statusBadge}">${r.status}</span>
          </div>
        </div>
      `).join('');
    }

    // Initialize Chart.js
    if (window.chartManager) {
      window.chartManager.initDashboardChart('dashboard-report-chart', 'sebulan');
    }
  }

  setChartPeriod(period, btnElement) {
    if (btnElement && btnElement.parentElement) {
      btnElement.parentElement.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
      btnElement.classList.add('active');
    }
    if (window.chartManager) {
      window.chartManager.initDashboardChart('dashboard-report-chart', period);
    }
  }

  /* HALAMAN BUAT LAPORAN*/
  renderReportForm() {
    // Reset file preview
    this.uploadedBeforePhoto = null;
    const previewContainer = document.getElementById('form-photo-preview');
    const dropzoneContent = document.getElementById('form-dropzone-content');
    if (previewContainer) previewContainer.style.display = 'none';
    if (dropzoneContent) dropzoneContent.style.display = 'flex';

    // Initialize Leaflet Map
    setTimeout(() => {
      if (window.mapManager) {
        window.mapManager.initFormMap('report-form-map', this.activeFormCoords, (lat, lng) => {
          this.activeFormCoords = [lat, lng];
          const coordsInput = document.getElementById('report-coords-text');
          if (coordsInput) {
            coordsInput.textContent = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
          }
        });
      }
    }, 150);
  }

  handlePhotoUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    window.supabaseService.uploadPhoto(file, 'kerusakan').then(photoUrl => {
      this.uploadedBeforePhoto = photoUrl;
      const previewContainer = document.getElementById('form-photo-preview');
      const previewImg = document.getElementById('form-preview-img');
      const dropzoneContent = document.getElementById('form-dropzone-content');

      if (previewImg) previewImg.src = photoUrl;
      if (previewContainer) previewContainer.style.display = 'block';
      if (dropzoneContent) dropzoneContent.style.display = 'none';
      this.showToast('Foto bukti berhasil diunggah!', 'success');
    });
  }

  removeUploadedPhoto() {
    this.uploadedBeforePhoto = null;
    const previewContainer = document.getElementById('form-photo-preview');
    const dropzoneContent = document.getElementById('form-dropzone-content');
    const fileInput = document.getElementById('report-file-input');

    if (previewContainer) previewContainer.style.display = 'none';
    if (dropzoneContent) dropzoneContent.style.display = 'flex';
    if (fileInput) fileInput.value = '';
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      this.showToast('Geolocation tidak didukung oleh browser Anda.', 'warning');
      return;
    }

    this.showToast('Mencari titik lokasi koordinat GPS Anda...', 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.activeFormCoords = [lat, lng];

        if (window.mapManager) {
          window.mapManager.setFormMarkerPosition(lat, lng);
        }

        const locInput = document.getElementById('report-location-input');
        if (locInput) locInput.value = `Koordinat GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

        const coordsInput = document.getElementById('report-coords-text');
        if (coordsInput) coordsInput.textContent = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;

        this.showToast('Lokasi GPS berhasil diterapkan!', 'success');
      },
      (err) => {
        this.showToast('Gagal membaca GPS. Silakan tentukan lokasi pada peta.', 'warning');
      }
    );
  }

  submitReportForm(e) {
    e.preventDefault();
    const category = document.getElementById('report-category-select').value;
    const title = document.getElementById('report-title-input').value.trim();
    const description = document.getElementById('report-desc-input').value.trim();
    const location = document.getElementById('report-location-input').value.trim();

    if (!title || !description || !location) {
      this.showToast('Mohon lengkapi semua kolom yang bertanda bintang.', 'warning');
      return;
    }

    const categoryLabels = {
      'Jalan': 'Jalan & Jembatan',
      'Lampu': 'Lampu Jalan (PJU)',
      'Drainase': 'Drainase & Gorong-gorong',
      'Fasilitas': 'Fasilitas Umum & Gedung',
      'Lainnya': 'Kebersihan & Lingkungan Hidup'
    };

    const newReportData = {
      title,
      category,
      categoryLabel: categoryLabels[category] || category,
      description,
      location,
      city: location.includes('Jakarta') ? 'Jakarta' : (location.includes('Bandung') ? 'Kota Bandung' : 'Kab. Bogor'),
      coords: this.activeFormCoords,
      photoBefore: this.uploadedBeforePhoto || 'assets/images/road_before.jpg'
    };

    window.supabaseService.createReport(newReportData).then(createdReport => {
      this.showReportSuccessModal(createdReport);
      // Reset form
      document.getElementById('report-create-form').reset();
      this.removeUploadedPhoto();
    });
  }

  showReportSuccessModal(report) {
    const modal = document.getElementById('modal-report-success');
    const ticketCodeEl = document.getElementById('modal-success-ticket');
    const ticketTitleEl = document.getElementById('modal-success-title');

    if (ticketCodeEl) ticketCodeEl.textContent = report.ticketCode;
    if (ticketTitleEl) ticketTitleEl.textContent = report.title;
    if (modal) modal.classList.add('active');

    this.selectedReportTicket = report.ticketCode;
  }

  /* DAFTAR LAPORAN SAYA */
  renderReportsList() {
    this.filterReportsList('all');
  }

  filterReportsList(statusFilter = null) {
    const activeChip = statusFilter ? statusFilter : (document.querySelector('.filter-chip.active')?.dataset.filter || 'all');
    
    // Update chip UI
    document.querySelectorAll('.filter-chip').forEach(chip => {
      if (chip.dataset.filter === activeChip) chip.classList.add('active');
      else chip.classList.remove('active');
    });

    const searchQuery = (document.getElementById('reports-search-input')?.value || '').toLowerCase().trim();
    const sortOrder = document.getElementById('reports-sort-select')?.value || 'newest';

    let reports = window.dataStore.getReports();

    // Filter by status
    if (activeChip !== 'all') {
      reports = reports.filter(r => {
        if (activeChip === 'proses') return r.status === 'Dalam Proses';
        if (activeChip === 'selesai') return r.status === 'Selesai';
        if (activeChip === 'tertunda') return r.status === 'Tertunda' || r.status === 'Menunggu';
        return true;
      });
    }

    // Filter by search query
    if (searchQuery) {
      reports = reports.filter(r => 
        r.title.toLowerCase().includes(searchQuery) ||
        r.ticketCode.toLowerCase().includes(searchQuery) ||
        r.location.toLowerCase().includes(searchQuery) ||
        r.category.toLowerCase().includes(searchQuery)
      );
    }

    // Sort
    if (sortOrder === 'oldest') {
      reports.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const container = document.getElementById('reports-list-container');
    const emptyState = document.getElementById('reports-empty-state');

    if (!container) return;

    if (reports.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = reports.map(r => `
      <div class="report-list-item card-hover" onclick="app.showReportDetail('${r.ticketCode}')">
        <div class="report-item-thumb" style="background-image: url('${r.photoBefore}');">
          ${r.buktiTuntas && r.buktiTuntas.isCompleted ? '<span class="thumb-tag-tuntas"><i class="fa-solid fa-circle-check"></i> BuktiTuntas</span>' : ''}
        </div>
        <div class="report-item-main">
          <div class="report-item-header">
            <h3 class="report-item-title">${r.title}</h3>
            <span class="report-item-ticket">${r.ticketCode}</span>
          </div>
          <p class="report-item-desc">${r.description}</p>
          <div class="report-item-footer">
            <span class="report-meta-tag"><i class="fa-solid fa-map-pin"></i> ${r.location}</span>
            <span class="report-meta-tag"><i class="fa-regular fa-calendar"></i> ${this.formatDate(r.createdAt)}</span>
            <span class="badge ${r.statusBadge}">${r.status}</span>
          </div>
        </div>
        <div class="report-item-action">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    `).join('');
  }

  showReportDetail(ticketCode) {
    this.selectedReportTicket = ticketCode;
    window.location.hash = `#detail-laporan/${ticketCode}`;
  }

  /*  DETAIL & TRACKING LAPORAN */
  renderReportDetail(ticketCode) {
    const report = window.dataStore.getReportByTicket(ticketCode) || window.dataStore.getReports()[0];
    if (!report) return;

    this.selectedReportId = report.id;
    this.selectedReportTicket = report.ticketCode;

    // Header & Meta
    const ticketCodeEl = document.getElementById('detail-ticket-code');
    const titleEl = document.getElementById('detail-title');
    const categoryEl = document.getElementById('detail-category');
    const locationEl = document.getElementById('detail-location');
    const dateEl = document.getElementById('detail-date');
    const agencyEl = document.getElementById('detail-agency');
    const descEl = document.getElementById('detail-description');
    const statusBadgeEl = document.getElementById('detail-status-badge');
    const heroThumbEl = document.getElementById('detail-hero-thumb');

    if (ticketCodeEl) ticketCodeEl.textContent = report.ticketCode;
    if (titleEl) titleEl.textContent = report.title;
    if (categoryEl) categoryEl.textContent = report.categoryLabel || report.category;
    if (locationEl) locationEl.textContent = report.location;
    if (dateEl) dateEl.textContent = this.formatDateWithTime(report.createdAt);
    if (agencyEl) agencyEl.textContent = report.agency || 'Dinas Terkait';
    if (descEl) descEl.textContent = report.description;
    if (statusBadgeEl) {
      statusBadgeEl.textContent = report.status;
      statusBadgeEl.className = `badge ${report.statusBadge}`;
    }
    if (heroThumbEl) {
      heroThumbEl.style.backgroundImage = `url('${report.photoBefore}')`;
    }

    // Render Timeline
    const timelineContainer = document.getElementById('detail-timeline-container');
    if (timelineContainer) {
      timelineContainer.innerHTML = report.timeline.map((step, idx) => {
        let stepClass = 'step-done';
        let icon = '<i class="fa-solid fa-check"></i>';
        if (step.status === 'in-progress') {
          stepClass = 'step-current';
          icon = '<i class="fa-solid fa-spinner fa-spin"></i>';
        } else if (step.status === 'delayed') {
          stepClass = 'step-delayed';
          icon = '<i class="fa-solid fa-clock"></i>';
        }

        return `
          <div class="timeline-step ${stepClass}">
            <div class="step-indicator">${icon}</div>
            <div class="step-content">
              <div class="step-header">
                <h4 class="step-title">${step.title}</h4>
                <span class="step-badge ${step.status === 'completed' ? 'badge-selesai' : (step.status === 'delayed' ? 'badge-tertunda' : 'badge-proses')}">
                  ${step.status === 'completed' ? 'Selesai' : (step.status === 'delayed' ? 'Tertunda' : 'Dalam Proses')}
                </span>
              </div>
              <p class="step-desc">${step.description}</p>
              <div class="step-meta">
                <span><i class="fa-regular fa-clock"></i> ${step.date}</span>
                <span>&bull;</span>
                <span><i class="fa-solid fa-building-columns"></i> ${step.actor}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render BuktiTuntas Card (Before vs After)
    this.renderBuktiTuntasCard(report);
  }

  renderBuktiTuntasCard(report) {
    const cardContainer = document.getElementById('buktituntas-card-wrapper');
    if (!cardContainer) return;

    const hasBuktiTuntas = report.buktiTuntas && report.buktiTuntas.isCompleted;

    if (!hasBuktiTuntas) {
      // Belum ada bukti tuntas
      cardContainer.innerHTML = `
        <div class="buktituntas-empty-card">
          <div class="empty-icon-shield">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h3>Menunggu BuktiTuntas Lapangan</h3>
          <p>Petugas dinas sedang melakukan penanganan fisik. Setelah pekerjaan selesai, foto verifikasi Sebelum vs Sesudah serta rincian teknis akan tampil di sini untuk dikonfirmasi oleh warga.</p>
          <div class="empty-photo-preview" style="background-image: url('${report.photoBefore}');">
            <span class="badge badge-foto-awal">Foto Kerusakan Awal</span>
          </div>
          ${this.isOfficerMode ? `
            <button class="btn btn-primary btn-block mt-4" onclick="app.openOfficerUpdateModal('${report.id}')">
              <i class="fa-solid fa-camera"></i> Unggah BuktiTuntas (Petugas)
            </button>
          ` : ''}
        </div>
      `;
      return;
    }

    // BuktiTuntas Tersedia! Render Slider & Citizen Confirmation
    const bt = report.buktiTuntas;
    const photoBefore = report.photoBefore;
    const photoAfter = report.photoAfter || 'assets/images/road_after.jpg';

    cardContainer.innerHTML = `
      <div class="buktituntas-active-box">
        <div class="buktituntas-header">
          <div class="bt-badge-title">
            <span class="shield-badge"><i class="fa-solid fa-circle-check"></i> BuktiTuntas Terverifikasi</span>
            <span class="bt-date">${bt.completedDate}</span>
          </div>
          <p class="bt-subtitle">Geser slider ke kiri dan kanan untuk membandingkan kondisi sebelum vs sesudah perbaikan.</p>
        </div>

        <!-- INTERACTIVE BEFORE/AFTER SLIDER -->
        <div class="before-after-slider-container" id="slider-container">
          <div class="slider-image-layer after-layer" style="background-image: url('${photoAfter}');">
            <span class="layer-pill pill-after"><i class="fa-solid fa-check"></i> SESUDAH (Tuntas)</span>
          </div>
          <div class="slider-image-layer before-layer" id="slider-before-layer" style="background-image: url('${photoBefore}'); width: 50%;">
            <span class="layer-pill pill-before"><i class="fa-solid fa-triangle-exclamation"></i> SEBELUM (Kerusakan)</span>
          </div>
          <div class="slider-divider" id="slider-divider" style="left: 50%;">
            <div class="slider-handle">
              <i class="fa-solid fa-left-right"></i>
            </div>
          </div>
        </div>

        <!-- METADATA TINDAK LANJUT -->
        <div class="bt-meta-grid">
          <div class="bt-meta-item">
            <span class="bt-meta-label">Petugas Pengawas</span>
            <span class="bt-meta-value">${bt.officerName}</span>
          </div>
          <div class="bt-meta-item">
            <span class="bt-meta-label">Satgas / Kontraktor</span>
            <span class="bt-meta-value">${bt.contractor}</span>
          </div>
          <div class="bt-meta-item">
            <span class="bt-meta-label">Durasi Pengerjaan</span>
            <span class="bt-meta-value">${bt.workDuration}</span>
          </div>
        </div>

        <div class="bt-notes-box">
          <strong><i class="fa-solid fa-clipboard-check"></i> Catatan Teknis Dinas:</strong>
          <p>${bt.notes}</p>
        </div>

        <!-- CITIZEN CONFIRMATION WORKFLOW -->
        <div class="citizen-confirmation-box ${bt.citizenConfirmed ? 'confirmed' : 'pending'}">
          ${bt.citizenConfirmed ? `
            <div class="confirmation-result">
              <div class="result-icon-check"><i class="fa-solid fa-thumbs-up"></i></div>
              <div class="result-details">
                <h4>Hasil Perbaikan Dikonfirmasi Warga</h4>
                <div class="star-rating-display">
                  ${'★'.repeat(bt.citizenRating || 5)}${'☆'.repeat(5 - (bt.citizenRating || 5))}
                  <span class="rating-text">(${bt.citizenRating || 5}/5 Bintang)</span>
                </div>
                <p class="user-feedback-quote">"${bt.citizenFeedback || 'Laporan telah dikonfirmasi selesai dengan baik.'}"</p>
              </div>
            </div>
          ` : `
            <div class="confirmation-prompt">
              <h4><i class="fa-solid fa-user-check"></i> Konfirmasi Hasil Pekerjaan</h4>
              <p>Apakah fasilitas umum di lokasi Anda telah selesai diperbaiki sesuai bukti di atas?</p>
              <div class="confirmation-actions">
                <button class="btn btn-success" onclick="app.openCitizenConfirmModal('${report.ticketCode}')">
                  <i class="fa-solid fa-check"></i> Ya, Masalah Selesai
                </button>
                <button class="btn btn-outline-danger" onclick="app.openDisputeModal('${report.ticketCode}')">
                  <i class="fa-solid fa-rotate-left"></i> Ajukan Sanggahan
                </button>
              </div>
            </div>
          `}
        </div>
      </div>
    `;

    // Rebind slider logic
    this.setupBuktiTuntasSlider();
  }

  setupBuktiTuntasSlider() {
    const container = document.getElementById('slider-container');
    const beforeLayer = document.getElementById('slider-before-layer');
    const divider = document.getElementById('slider-divider');

    if (!container || !beforeLayer || !divider) return;

    const moveSlider = (clientX) => {
      const rect = container.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      beforeLayer.style.width = `${percentage}%`;
      divider.style.left = `${percentage}%`;
    };

    // Mouse events
    const onMouseDown = (e) => {
      this.isDraggingSlider = true;
      moveSlider(e.clientX);
    };

    const onMouseMove = (e) => {
      if (!this.isDraggingSlider) return;
      moveSlider(e.clientX);
    };

    const onMouseUp = () => {
      this.isDraggingSlider = false;
    };

    // Touch events for mobile
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        moveSlider(e.touches[0].clientX);
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', (e) => {
      this.isDraggingSlider = true;
      if (e.touches.length > 0) moveSlider(e.touches[0].clientX);
    });
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', () => { this.isDraggingSlider = false; });
  }

  openCitizenConfirmModal(ticketCode) {
    const modal = document.getElementById('modal-citizen-confirm');
    const ticketEl = document.getElementById('confirm-modal-ticket');
    if (ticketEl) ticketEl.textContent = ticketCode;
    if (modal) modal.classList.add('active');

    // Default 5 stars
    this.setStarRating(5);
  }

  setStarRating(rating) {
    this.currentRating = rating;
    document.querySelectorAll('.star-btn').forEach(btn => {
      const starVal = parseInt(btn.dataset.star, 10);
      if (starVal <= rating) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  submitCitizenConfirmation() {
    const feedback = document.getElementById('confirm-feedback-input')?.value || 'Pekerjaan selesai dengan baik.';
    const rating = this.currentRating || 5;

    window.supabaseService.confirmCitizenReport(this.selectedReportTicket, rating, feedback).then(updatedReport => {
      this.closeModal('modal-citizen-confirm');
      this.showToast('Terima kasih! Konfirmasi dan penilaian Anda telah dicatat dalam sistem.', 'success');
      this.renderReportDetail(this.selectedReportTicket);
    });
  }

  openDisputeModal(ticketCode) {
    const note = prompt('Tuliskan alasan sanggahan jika perbaikan belum tuntas atau tidak sesuai:');
    if (note) {
      this.showToast('Sanggahan Anda berhasil diajukan dan dikirim kembali ke penanggung jawab dinas.', 'warning');
      window.dataStore.updateReportStatus(this.selectedReportId, 'Dalam Proses', `Sanggahan warga: "${note}" - Diperlukan tinjauan perbaikan tambahan.`);
      this.renderReportDetail(this.selectedReportTicket);
    }
  }

  /* PENGADUAN PELAYANAN PUBLIK*/
  renderComplaints() {
    const container = document.getElementById('complaints-list-container');
    if (!container) return;

    const complaints = window.dataStore.getComplaints();
    container.innerHTML = complaints.map(c => `
      <div class="complaint-card">
        <div class="complaint-header">
          <span class="complaint-ticket">${c.ticketCode}</span>
          <span class="badge badge-proses">${c.status}</span>
        </div>
        <h4 class="complaint-title">${c.title}</h4>
        <div class="complaint-agency"><i class="fa-solid fa-landmark"></i> ${c.agency} &bull; ${c.category}</div>
        <p class="complaint-desc">${c.description}</p>
        <div class="complaint-date"><i class="fa-regular fa-clock"></i> Diajukan pada: ${this.formatDateWithTime(c.createdAt)}</div>
      </div>
    `).join('');
  }

  submitComplaintForm(e) {
    e.preventDefault();
    const category = document.getElementById('complaint-category').value;
    const agency = document.getElementById('complaint-agency').value;
    const title = document.getElementById('complaint-title').value;
    const description = document.getElementById('complaint-desc').value;

    const newComplaint = window.dataStore.addComplaint({
      category, agency, title, description
    });

    this.showToast(`Pengaduan berhasil dikirim! Nomor tiket Anda: ${newComplaint.ticketCode}`, 'success');
    document.getElementById('complaint-create-form').reset();
    this.renderComplaints();
  }

  /*  PERIZINAN ONLINE */
  renderPermits() {
    const container = document.getElementById('permits-list-container');
    if (!container) return;

    const permits = window.dataStore.getPermits();
    container.innerHTML = permits.map(p => `
      <div class="permit-card">
        <div class="permit-header">
          <span class="permit-ticket">${p.ticketCode}</span>
          <span class="badge badge-proses">${p.status}</span>
        </div>
        <h4 class="permit-title">${p.businessName}</h4>
        <div class="permit-type"><i class="fa-solid fa-stamp"></i> ${p.permitType} &bull; ${p.businessCategory}</div>
        <p class="permit-loc"><i class="fa-solid fa-location-dot"></i> ${p.location}</p>
        
        <!-- Step progress indicator -->
        <div class="permit-steps-bar">
          <div class="permit-step ${p.step >= 1 ? 'active' : ''}">1. Permohonan</div>
          <div class="permit-step ${p.step >= 2 ? 'active' : ''}">2. Berkas</div>
          <div class="permit-step ${p.step >= 3 ? 'active' : ''}">3. Tinjauan</div>
          <div class="permit-step ${p.step >= 4 ? 'active' : ''}">4. SK Terbit</div>
        </div>
      </div>
    `).join('');
  }

  submitPermitForm(e) {
    e.preventDefault();
    const permitType = document.getElementById('permit-type-select').value;
    const businessName = document.getElementById('permit-business-name').value;
    const businessCategory = document.getElementById('permit-business-category').value;
    const location = document.getElementById('permit-location').value;

    const newPermit = window.dataStore.addPermit({
      permitType, businessName, businessCategory, location
    });

    this.showToast(`Permohonan perizinan berhasil diajukan! Tiket: ${newPermit.ticketCode}`, 'success');
    document.getElementById('permit-create-form').reset();
    this.renderPermits();
  }

  /* BANSOS*/
  renderBansos() {
    // Initial display
  }

  checkBansosStatus() {
    const input = document.getElementById('bansos-nik-input');
    const resultBox = document.getElementById('bansos-result-box');
    if (!input || !resultBox) return;

    const query = input.value.trim();
    if (!query) {
      this.showToast('Silakan masukkan NIK 16 digit atau Kode Program (misal: PKH, BPNT).', 'warning');
      return;
    }

    const match = window.dataStore.checkBansos(query);
    resultBox.style.display = 'block';

    if (match) {
      resultBox.innerHTML = `
        <div class="bansos-card-found">
          <div class="bansos-found-header">
            <div>
              <span class="badge badge-selesai">${match.status}</span>
              <h3 class="bansos-prog-title">${match.programName}</h3>
            </div>
            <div class="bansos-nominal-badge">${match.nominal}</div>
          </div>
          <div class="bansos-details-grid">
            <div><strong>Nama Penerima:</strong> ${match.applicantName}</div>
            <div><strong>NIK:</strong> ${match.nik}</div>
            <div><strong>Tahap Penyaluran:</strong> ${match.batch}</div>
            <div><strong>Lokasi Penyaluran:</strong> ${match.distributionPoint}</div>
          </div>
          <div class="bansos-notes-alert">
            <i class="fa-solid fa-circle-info"></i> ${match.notes}
          </div>
        </div>
      `;
    } else {
      resultBox.innerHTML = `
        <div class="bansos-card-notfound">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <h4>Data Tidak Ditemukan</h4>
          <p>NIK <strong>"${query}"</strong> belum tercatat dalam daftar penerima bantuan tahap ini. Silakan hubungi RT/RW atau Kelurahan setempat untuk pendataan DTKS Kemensos.</p>
          <div class="demo-nik-hint">
            💡 <em>Coba NIK Demo: <code>3171012345670001</code> (PKH) atau <code>3171012345670002</code> (BPNT)</em>
          </div>
        </div>
      `;
    }
  }

  /* DATA & TRANSPARANSI PUBLIK */
  renderTransparency() {
    const stats = window.dataStore.getStatistics();
    
    const totalEl = document.getElementById('transp-total-laporan');
    const selesaiEl = document.getElementById('transp-selesai');
    const prosesEl = document.getElementById('transp-proses');
    const tertundaEl = document.getElementById('transp-tertunda');

    if (totalEl) totalEl.textContent = stats.total.toLocaleString('id-ID');
    if (selesaiEl) selesaiEl.textContent = stats.selesai.toLocaleString('id-ID');
    if (prosesEl) prosesEl.textContent = stats.dalamProses.toLocaleString('id-ID');
    if (tertundaEl) tertundaEl.textContent = stats.tertunda.toLocaleString('id-ID');

    // Init Leaflet Map
    setTimeout(() => {
      if (window.mapManager) {
        window.mapManager.initTransparencyMap('transparency-map', 'all');
      }
      if (window.chartManager) {
        window.chartManager.initTransparencyCharts();
      }
    }, 200);
  }

  filterTransparencyMapCategory(category) {
    document.querySelectorAll('.map-filter-chip').forEach(c => {
      if (c.dataset.cat === category) c.classList.add('active');
      else c.classList.remove('active');
    });

    if (window.mapManager) {
      window.mapManager.renderTransparencyMarkers(category);
    }
  }

  /* PORTAL PUBLIK*/
  searchPublicTicket(ticketCode = null) {
    const input = document.getElementById('public-search-input');
    const ticket = ticketCode || (input ? input.value.trim() : '');
    const resultContainer = document.getElementById('public-ticket-result');

    if (!ticket) {
      this.showToast('Masukkan kode tiket (contoh: INF-2025-0012).', 'warning');
      return;
    }

    const report = window.dataStore.getReportByTicket(ticket);
    if (!resultContainer) return;

    resultContainer.style.display = 'block';

    if (report) {
      resultContainer.innerHTML = `
        <div class="public-result-card animate-slide-in">
          <div class="public-result-header">
            <div>
              <span class="badge ${report.statusBadge}">${report.status}</span>
              <h3>${report.title}</h3>
              <span class="public-ticket-badge">${report.ticketCode}</span>
            </div>
            <button class="btn btn-primary" onclick="app.showReportDetail('${report.ticketCode}')">
              Buka Detail Penuh & BuktiTuntas <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div class="public-result-body">
            <p>${report.description}</p>
            <div class="public-meta-row">
              <span><i class="fa-solid fa-location-dot"></i> ${report.location}</span>
              <span><i class="fa-regular fa-calendar"></i> ${this.formatDate(report.createdAt)}</span>
              <span><i class="fa-solid fa-building-columns"></i> ${report.agency}</span>
            </div>
          </div>
        </div>
      `;
    } else {
      resultContainer.innerHTML = `
        <div class="public-result-empty">
          <i class="fa-solid fa-magnifying-glass"></i>
          <h4>Laporan Tidak Ditemukan</h4>
          <p>Tiket dengan kode <strong>${ticket}</strong> tidak ditemukan dalam basis data.</p>
          <div class="demo-tickets-hint">
            Contoh tiket tersedia: <a href="javascript:void(0)" onclick="app.searchPublicTicket('INF-2025-0012')">INF-2025-0012</a> &bull; 
            <a href="javascript:void(0)" onclick="app.searchPublicTicket('INF-2025-0011')">INF-2025-0011</a>
          </div>
        </div>
      `;
    }
  }

  /*DASHBOARD INSTANSI (PETUGAS LAPANGAN / DINAS PU) */
  renderOfficerDashboard() {
    const reports = window.dataStore.getReports();
    const stats = window.dataStore.getStatistics();

    // Officer stats
    const assignedEl = document.getElementById('officer-stat-masuk');
    const prosesEl = document.getElementById('officer-stat-proses');
    const selesaiEl = document.getElementById('officer-stat-selesai');
    const pendingEl = document.getElementById('officer-stat-verifikasi');

    if (assignedEl) assignedEl.textContent = '1.248';
    if (prosesEl) prosesEl.textContent = '842';
    if (selesaiEl) selesaiEl.textContent = '351';
    if (pendingEl) pendingEl.textContent = '55';

    // Render Officer Table
    const tableBody = document.getElementById('officer-reports-table-body');
    if (tableBody) {
      tableBody.innerHTML = reports.map(r => `
        <tr>
          <td><strong class="ticket-cell">${r.ticketCode}</strong></td>
          <td>${r.categoryLabel || r.category}</td>
          <td>${r.title}</td>
          <td>${r.location}</td>
          <td><span class="badge ${r.statusBadge}">${r.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn btn-xs btn-outline" onclick="app.showReportDetail('${r.ticketCode}')" title="Lihat Detail">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn btn-xs btn-primary" onclick="app.openOfficerUpdateModal('${r.id}')" title="Update Status & Bukti">
                <i class="fa-solid fa-pen-to-square"></i> Update
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // Mini Map
    setTimeout(() => {
      if (window.mapManager) {
        window.mapManager.initOfficerTaskMap('officer-task-map');
      }
      if (window.chartManager) {
        window.chartManager.initOfficerCharts();
      }
    }, 200);
  }

  openOfficerUpdateModal(reportId) {
    const report = window.dataStore.getReportById(reportId);
    if (!report) return;

    this.selectedReportId = report.id;
    this.officerUploadedAfterPhoto = null;

    const modal = document.getElementById('modal-officer-update');
    const titleEl = document.getElementById('officer-modal-report-title');
    const ticketEl = document.getElementById('officer-modal-ticket');
    const statusSelect = document.getElementById('officer-status-select');
    const notesInput = document.getElementById('officer-notes-input');
    const previewContainer = document.getElementById('officer-photo-preview');

    if (titleEl) titleEl.textContent = report.title;
    if (ticketEl) ticketEl.textContent = report.ticketCode;
    if (statusSelect) statusSelect.value = report.status;
    if (notesInput) notesInput.value = '';
    if (previewContainer) previewContainer.style.display = 'none';

    if (modal) modal.classList.add('active');
  }

  handleOfficerPhotoUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    window.supabaseService.uploadPhoto(file, 'buktituntas').then(url => {
      this.officerUploadedAfterPhoto = url;
      const previewContainer = document.getElementById('officer-photo-preview');
      const previewImg = document.getElementById('officer-preview-img');
      if (previewImg) previewImg.src = url;
      if (previewContainer) previewContainer.style.display = 'block';
      this.showToast('Foto hasil pekerjaan BuktiTuntas berhasil diunggah!', 'success');
    });
  }

  submitOfficerUpdate() {
    const status = document.getElementById('officer-status-select').value;
    const notes = document.getElementById('officer-notes-input').value;
    const photoAfter = this.officerUploadedAfterPhoto || 'assets/images/road_after.jpg';

    window.supabaseService.updateReportStatus(this.selectedReportId, status, notes, photoAfter).then(() => {
      this.closeModal('modal-officer-update');
      this.showToast(`Status laporan berhasil diperbarui menjadi "${status}"!`, 'success');
      this.renderOfficerDashboard();
      if (this.selectedReportTicket) {
        this.renderReportDetail(this.selectedReportTicket);
      }
    });
  }

  /*PROFIL & PENGATURAN */
  renderProfile() {
    const user = window.dataStore.getCurrentUser();
    const nameInput = document.getElementById('profile-input-name');
    const emailInput = document.getElementById('profile-input-email');
    const phoneInput = document.getElementById('profile-input-phone');
    const nikInput = document.getElementById('profile-input-nik');
    const addressInput = document.getElementById('profile-input-address');

    if (nameInput) nameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
    if (phoneInput) phoneInput.value = user.phone || '0812-3456-7890';
    if (nikInput) nikInput.value = user.nik || '3171012345670001';
    if (addressInput) addressInput.value = user.address || 'Jl. Melati No. 10, Jakarta Pusat';
  }

  saveProfile(e) {
    e.preventDefault();
    const user = window.dataStore.getCurrentUser();
    user.name = document.getElementById('profile-input-name').value;
    user.phone = document.getElementById('profile-input-phone').value;
    user.address = document.getElementById('profile-input-address').value;

    window.dataStore.saveCurrentUser(user);
    this.syncCurrentUser();
    this.showToast('Perubahan profil berhasil disimpan!', 'success');
  }

  /* MODALS & HELPERS*/
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  copyTicketCode(ticketCode = null) {
    const code = ticketCode || this.selectedReportTicket;
    if (navigator.clipboard && code) {
      navigator.clipboard.writeText(code).then(() => {
        this.showToast(`Kode tiket ${code} berhasil disalin!`, 'info');
      });
    }
  }

  formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatDateWithTime(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
  }

  formatTimeAgo(isoString) {
    if (!isoString) return 'Baru saja';
    const past = new Date(isoString).getTime();
    const now = Date.now();
    const diffHours = Math.floor((now - past) / (1000 * 60 * 60));

    if (diffHours < 1) return '30 menit yang lalu';
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Kemarin';
    return `${diffDays} hari yang lalu`;
  }
}

// Instantiate App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
