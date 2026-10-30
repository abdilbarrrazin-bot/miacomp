

const STORAGE_KEYS = {
  REPORTS: 'infrastrukturku_reports_v1',
  COMPLAINTS: 'infrastrukturku_complaints_v1',
  PERMITS: 'infrastrukturku_permits_v1',
  BANSOS: 'infrastrukturku_bansos_v1',
  CURRENT_USER: 'infrastrukturku_user_v1',
  SUPABASE_SETTINGS: 'infrastrukturku_supabase_cfg_v1'
};

// Initial Seed Data
const INITIAL_REPORTS = [
  {
    id: 'rep-001',
    ticketCode: 'INF-2025-0012',
    title: 'Jalan rusak di Jl. Melati',
    category: 'Jalan',
    categoryLabel: 'Jalan & Jembatan',
    description: 'Terdapat lubang cukup besar di tengah jalan yang membahayakan pengendara motor, terutama saat malam hari dan saat hujan karena tertutup genangan air.',
    location: 'Jl. Melati No. 14, Menteng, Jakarta Pusat',
    city: 'Jakarta Pusat',
    coords: [-6.1895, 106.8322],
    photoBefore: 'assets/images/road_before.jpg',
    photoAfter: 'assets/images/road_after.jpg',
    status: 'Selesai', // Selesai / Dalam Proses / Menunggu / Tertunda
    statusBadge: 'status-selesai',
    agency: 'Dinas Bina Marga DKI Jakarta',
    reporterName: 'Andi Pratama',
    reporterEmail: 'andipratama@gmail.com',
    reporterPhone: '0812-3456-7890',
    createdAt: '2025-05-10T10:24:00+07:00',
    updatedAt: '2025-05-14T16:00:00+07:00',
    timeline: [
      {
        id: 't-1',
        title: 'Laporan diterima',
        description: 'Laporan berhasil dibuat oleh masyarakat dan masuk antrean sistem verifikasi.',
        date: '10 Mei 2025 - 10:24 WIB',
        actor: 'Masyarakat',
        status: 'completed'
      },
      {
        id: 't-2',
        title: 'Verifikasi petugas',
        description: 'Data kerusakan telah diverifikasi oleh tim peninjau wilayah Jakarta Pusat.',
        date: '10 Mei 2025 - 14:30 WIB',
        actor: 'Dinas Bina Marga',
        status: 'completed'
      },
      {
        id: 't-3',
        title: 'Tindak lanjut perbaikan',
        description: 'Pengerjaan pengurukan dan pengaspalan ulang hotmix di lokasi Jl. Melati.',
        date: '12 Mei 2025 - 09:15 WIB',
        actor: 'Tim Reaksi Cepat PU',
        status: 'completed'
      },
      {
        id: 't-4',
        title: 'Perbaikan selesai (BuktiTuntas)',
        description: 'Pekerjaan rampung dan foto bukti perbaikan telah diunggah oleh pengawas lapangan.',
        date: '14 Mei 2025 - 15:45 WIB',
        actor: 'Pengawas Teknis PU',
        status: 'completed'
      }
    ],
    // Fitur BuktiTuntas metadata
    buktiTuntas: {
      isCompleted: true,
      completedDate: '14 Mei 2025',
      officerName: 'Budi Santoso, S.T.',
      officerNip: '198403152009021004',
      workDuration: '3 Hari Kerja',
      contractor: 'Satgas Jalan Lingkungan Dinas PU',
      notes: 'Pengaspalan hotmix seluas 4.5m x 2.2m telah diratakan dan diuji kekuatannya. Aliran air samping juga telah disesuaikan.',
      citizenConfirmed: true,
      citizenRating: 5,
      citizenFeedback: 'Pengerjaan sangat cepat dan aspal mulus kembali! Terima kasih Dinas Bina Marga.'
    }
  },
  {
    id: 'rep-002',
    ticketCode: 'INF-2025-0011',
    title: 'Lampu jalan mati di perempatan',
    category: 'Lampu',
    categoryLabel: 'Lampu Jalan (PJU)',
    description: 'Tiga titik lampu PJU mati total sejak 5 hari yang lalu, lokasi sangat gelap dan rawan kecelakaan di pertigaan jalan utama.',
    location: 'Jl. Kaliurang KM 9, Sinduharjo, Sleman',
    city: 'Kab. Sleman',
    coords: [-7.7325, 110.3956],
    photoBefore: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    status: 'Menunggu',
    statusBadge: 'status-menunggu',
    agency: 'Dinas Perhubungan Sleman',
    reporterName: 'Andi Pratama',
    reporterEmail: 'andipratama@gmail.com',
    reporterPhone: '0812-3456-7890',
    createdAt: '2025-05-10T08:15:00+07:00',
    updatedAt: '2025-05-10T08:15:00+07:00',
    timeline: [
      {
        id: 't-1',
        title: 'Laporan diterima',
        description: 'Laporan masuk sistem pengaduan penerangan jalan umum.',
        date: '10 Mei 2025 - 08:15 WIB',
        actor: 'Masyarakat',
        status: 'completed'
      },
      {
        id: 't-2',
        title: 'Antrean Verifikasi Lapangan',
        description: 'Menunggu jadwal inspeksi tim Dishub wilayah Sleman.',
        date: '10 Mei 2025 - 08:30 WIB',
        actor: 'Sistem Lapor',
        status: 'in-progress'
      }
    ],
    buktiTuntas: null
  },
  {
    id: 'rep-003',
    ticketCode: 'INF-2025-0010',
    title: 'Drainase tersumbat sampah & lumpur',
    category: 'Drainase',
    categoryLabel: 'Drainase & Gorong-gorong',
    description: 'Saluran air tertimbun endapan lumpur tebal dan sampah plastik sehingga air meluap ke badan jalan saat hujan deras.',
    location: 'Jl. Darmo No. 88, Wonokromo, Surabaya',
    city: 'Kota Surabaya',
    coords: [-7.2912, 112.7381],
    photoBefore: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    status: 'Selesai',
    statusBadge: 'status-selesai',
    agency: 'Dinas Sumber Daya Air & Bina Marga Surabaya',
    reporterName: 'Siti Rahmawati',
    reporterEmail: 'siti.rahma@gmail.com',
    reporterPhone: '0813-8888-2190',
    createdAt: '2025-05-08T13:40:00+07:00',
    updatedAt: '2025-05-09T17:30:00+07:00',
    timeline: [
      {
        id: 't-1',
        title: 'Laporan diterima',
        date: '08 Mei 2025 - 13:40 WIB',
        description: 'Laporan drainase tercatat.',
        actor: 'Masyarakat',
        status: 'completed'
      },
      {
        id: 't-2',
        title: 'Pembersihan Alat Berat',
        date: '09 Mei 2025 - 09:00 WIB',
        description: 'Tim Satgas drainase mengeruk sedimentasi lumpur.',
        actor: 'Dinas SDA',
        status: 'completed'
      },
      {
        id: 't-3',
        title: 'Perbaikan Selesai',
        date: '09 Mei 2025 - 16:45 WIB',
        description: 'Saluran air bersih dan aliran normal kembali.',
        actor: 'Dinas SDA',
        status: 'completed'
      }
    ],
    buktiTuntas: {
      isCompleted: true,
      completedDate: '09 Mei 2025',
      officerName: 'Agus Wardoyo',
      officerNip: '197905102008011007',
      workDuration: '1 Hari',
      contractor: 'Satgas Saluran Air Kota Surabaya',
      notes: 'Pembersihan sedimentasi sedalam 70cm sepanjang 150 meter berhasil dilakukan.',
      citizenConfirmed: true,
      citizenRating: 4,
      citizenFeedback: 'Bagus dan cepat tanggap, terima kasih atas pembersihannya.'
    }
  },
  {
    id: 'rep-004',
    ticketCode: 'INF-2025-0009',
    title: 'Fasilitas pagar & atap sekolah rusak',
    category: 'Fasilitas',
    categoryLabel: 'Fasilitas Umum & Pendidikan',
    description: 'Pagar pembatas SDN 02 Cibinong retak miring dan genteng teras roboh akibat angin kencang kemarin sore.',
    location: 'Jl. Raya Jakarta-Bogor KM 42, Cibinong, Bogor',
    city: 'Kab. Bogor',
    coords: [-6.4815, 106.8524],
    photoBefore: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    status: 'Dalam Proses',
    statusBadge: 'status-proses',
    agency: 'Dinas Perumahan & Sarana Permukiman Bogor',
    reporterName: 'Andi Pratama',
    reporterEmail: 'andipratama@gmail.com',
    reporterPhone: '0812-3456-7890',
    createdAt: '2025-05-07T11:20:00+07:00',
    updatedAt: '2025-05-08T10:15:00+07:00',
    timeline: [
      {
        id: 't-1',
        title: 'Laporan diterima',
        date: '07 Mei 2025 - 11:20 WIB',
        description: 'Laporan fasilitas pendidikan masuk.',
        actor: 'Masyarakat',
        status: 'completed'
      },
      {
        id: 't-2',
        title: 'Verifikasi Struktural',
        date: '08 Mei 2025 - 09:30 WIB',
        description: 'Pengecekan stabilitas tembok dan atap sekolah.',
        actor: 'Dinas Perkim',
        status: 'completed'
      },
      {
        id: 't-3',
        title: 'Renovasi Pagar & Atap',
        date: '09 Mei 2025 - 08:00 WIB',
        description: 'Pemasangan baja ringan dan pengecoran pondasi baru.',
        actor: 'Kontraktor Dinas',
        status: 'in-progress'
      }
    ],
    buktiTuntas: {
      isCompleted: false,
      completedDate: null,
      officerName: 'Hendra Kusuma',
      officerNip: '198711042010011003',
      workDuration: 'Estimasi 5 Hari',
      contractor: 'CV Bina Bangun Persada',
      notes: 'Pekerjaan pondasi baru mencapai 60%. Material rangka baja ringan sudah tiba di lokasi.',
      citizenConfirmed: false,
      citizenRating: null,
      citizenFeedback: null
    }
  },
  {
    id: 'rep-005',
    ticketCode: 'INF-2025-0008',
    title: 'Tumpukan sampah liar di trotoar jalan',
    category: 'Lainnya',
    categoryLabel: 'Kebersihan & Lingkungan Hidup',
    description: 'Tempat pembuangan sampah liar menumpuk di pedestrian dekat jembatan penyeberangan orang, bau menyengat.',
    location: 'Jl. Soekarno Hatta No. 450, Batununggal, Bandung',
    city: 'Kota Bandung',
    coords: [-6.9427, 107.6321],
    photoBefore: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    status: 'Tertunda',
    statusBadge: 'status-tertunda',
    agency: 'Dinas Lingkungan Hidup Kota Bandung',
    reporterName: 'Fajar Nugraha',
    reporterEmail: 'fajar.nug@gmail.com',
    reporterPhone: '0857-1234-9988',
    createdAt: '2025-05-05T09:10:00+07:00',
    updatedAt: '2025-05-06T14:00:00+07:00',
    timeline: [
      {
        id: 't-1',
        title: 'Laporan Diterima',
        date: '05 Mei 2025 - 09:10 WIB',
        description: 'Laporan tumpukan sampah dicatat.',
        actor: 'Masyarakat',
        status: 'completed'
      },
      {
        id: 't-2',
        title: 'Tertunda - Koordinasi Armada Truk',
        date: '06 Mei 2025 - 14:00 WIB',
        description: 'Armada pengangkut terjadwal bergiliran di TPA regional.',
        actor: 'DLH Bandung',
        status: 'delayed'
      }
    ],
    buktiTuntas: null
  },
  {
    id: 'rep-006',
    ticketCode: 'INF-2025-0007',
    title: 'Jembatan kayu penghubung desa retak',
    category: 'Jalan',
    categoryLabel: 'Jalan & Jembatan',
    description: 'Bantalan kayu penyangga jembatan penyeberangan warga patah sehingga tidak bisa dilalui kendaraan roda dua.',
    location: 'Desa Bojonggede RT 04 RW 02, Bogor',
    city: 'Kab. Bogor',
    coords: [-6.4952, 106.7972],
    photoBefore: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    status: 'Dalam Proses',
    statusBadge: 'status-proses',
    agency: 'Dinas PU & Penataan Ruang Kab. Bogor',
    reporterName: 'Ahmad Supardi',
    reporterEmail: 'ahmad.supardi@gmail.com',
    reporterPhone: '0819-0123-4567',
    createdAt: '2025-05-04T16:20:00+07:00',
    updatedAt: '2025-05-06T11:00:00+07:00',
    timeline: [
      {
        id: 't-1',
        title: 'Laporan Diterima',
        date: '04 Mei 2025 - 16:20 WIB',
        description: 'Laporan jembatan darurat masuk.',
        actor: 'Masyarakat',
        status: 'completed'
      },
      {
        id: 't-2',
        title: 'Pemasangan Rangka Baja Pengganti',
        date: '06 Mei 2025 - 11:00 WIB',
        description: 'Rangka baja pengganti gelagar kayu sedang dipasang.',
        actor: 'Tim Tanggap Darurat PU',
        status: 'in-progress'
      }
    ],
    buktiTuntas: null
  }
];

// Initial Complaints (Pengaduan Pelayanan)
const INITIAL_COMPLAINTS = [
  {
    id: 'cmp-001',
    ticketCode: 'PGD-2025-0041',
    category: 'Pelayanan Kantor Kelurahan / Kecamatan',
    agency: 'Kantor Kelurahan Menteng',
    title: 'Pelayanan KTP Lambat dan Ada Pungutan Tidak Resmi',
    description: 'Petugas loket meminta biaya tambahan sebesar Rp 50.000 untuk pengurusan cetak ulang e-KTP dengan dalih uang administrasi map.',
    evidenceUrl: null,
    status: 'Dalam Investigasi',
    createdAt: '2025-05-08T14:10:00+07:00'
  },
  {
    id: 'cmp-002',
    ticketCode: 'PGD-2025-0038',
    category: 'Puskesmas & Layanan Kesehatan',
    agency: 'Puskesmas Kecamatan Gambir',
    title: 'Antrean Poli Gigi Tidak Sesuai Nomor Online',
    description: 'Pasien yang mendaftar melalui aplikasi tidak dipanggil sesuai nomor antrean digital, terjadi loncatan pasien tanpa penjelasan.',
    evidenceUrl: null,
    status: 'Selesai Ditindak',
    createdAt: '2025-05-02T09:40:00+07:00'
  }
];

// Initial Permits (Perizinan)
const INITIAL_PERMITS = [
  {
    id: 'pmt-001',
    ticketCode: 'IZN-2025-0104',
    permitType: 'Izin Usaha Mikro & Kecil (IUMK)',
    businessName: 'Kedai Kopi Melati Rasa',
    businessCategory: 'F&B / Kuliner Kafe',
    location: 'Jl. Melati No. 10, Jakarta Pusat',
    status: 'Verifikasi Berkas Selesai',
    step: 2, // 1: Terkirim, 2: Verifikasi, 3: Tinjau Lapangan, 4: Terbit SK
    createdAt: '2025-05-06T10:00:00+07:00'
  },
  {
    id: 'pmt-002',
    ticketCode: 'IZN-2025-0089',
    permitType: 'Persetujuan Bangunan Gedung (PBG)',
    businessName: 'Renovasi Rumah Tinggal & Toko',
    businessCategory: 'Konstruksi / Hunian Komersial',
    location: 'Jl. Tebet Barat Dalam No. 12',
    status: 'Tinjau Lapangan',
    step: 3,
    createdAt: '2025-04-28T11:30:00+07:00'
  }
];

// Initial Bansos Database (Bantuan Sosial)
const INITIAL_BANSOS_DATABASE = [
  {
    nik: '3171012345670001',
    applicantName: 'Andi Pratama',
    programName: 'Program Keluarga Harapan (PKH)',
    programCode: 'PKH',
    status: 'Terdaftar & Siap Disalurkan',
    nominal: 'Rp 750.000 / Tahap',
    batch: 'Tahap 2 - Mei 2025',
    distributionPoint: 'Bank Himbara (BNI) & Kantor Pos Terdekat',
    statusClass: 'status-selesai',
    notes: 'Kriteria komponen pendidikan anak usia sekolah terpenuhi.'
  },
  {
    nik: '3171012345670002',
    applicantName: 'Budi Santoso',
    programName: 'Bantuan Pangan Non Tunai (BPNT)',
    programCode: 'BPNT',
    status: 'Penyaluran Aktif Melalui E-Warong',
    nominal: 'Rp 200.000 / Bulan (Sembako)',
    batch: 'Mei 2025',
    distributionPoint: 'E-Warong Kelurahan Menteng',
    statusClass: 'status-selesai',
    notes: 'Bahan pokok: Beras 10kg, Telur 1kg, Minyak Goreng 2L.'
  },
  {
    nik: '3171012345670003',
    applicantName: 'Siti Aminah',
    programName: 'BLT Dana Desa / Kelurahan',
    programCode: 'BLT',
    status: 'Proses Verifikasi Kelayakan DTKS',
    nominal: 'Rp 300.000 / Bulan',
    batch: 'Menunggu Pengesahan Muskel',
    distributionPoint: 'Balai Warga RW 05',
    statusClass: 'status-proses',
    notes: 'Menunggu penetapan daftar penerima final oleh kelurahan.'
  }
];

// Initial Default User Profile
const DEFAULT_USER = {
  id: 'usr-001',
  name: 'Andi Pratama',
  email: 'andipratama@gmail.com',
  phone: '0812-3456-7890',
  nik: '3171012345670001',
  address: 'Jl. Melati No. 10, Jakarta Pusat',
  role: 'warga', // 'warga' or 'petugas'
  roleLabel: 'Masyarakat',
  agencyName: null,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
};

// Data Store Handler
class DataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PERMITS)) {
      localStorage.setItem(STORAGE_KEYS.PERMITS, JSON.stringify(INITIAL_PERMITS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BANSOS)) {
      localStorage.setItem(STORAGE_KEYS.BANSOS, JSON.stringify(INITIAL_BANSOS_DATABASE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USER));
    }
  }

  // Reports API
  getReports() {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : INITIAL_REPORTS;
  }

  getReportByTicket(ticketCode) {
    const reports = this.getReports();
    return reports.find(r => r.ticketCode.toUpperCase() === ticketCode.toUpperCase().trim());
  }

  getReportById(id) {
    const reports = this.getReports();
    return reports.find(r => r.id === id);
  }

  addReport(newReportData) {
    const reports = this.getReports();
    const currentYear = new Date().getFullYear();
    const nextSeq = (reports.length + 1).toString().padStart(4, '0');
    const ticketCode = `INF-${currentYear}-${nextSeq}`;

    const newReport = {
      id: 'rep-' + Date.now(),
      ticketCode,
      title: newReportData.title,
      category: newReportData.category || 'Jalan',
      categoryLabel: newReportData.categoryLabel || 'Jalan & Jembatan',
      description: newReportData.description,
      location: newReportData.location,
      city: newReportData.city || 'DKI Jakarta',
      coords: newReportData.coords || [-6.1895, 106.8322],
      photoBefore: newReportData.photoBefore || 'assets/images/road_before.jpg',
      photoAfter: null,
      status: 'Dalam Proses',
      statusBadge: 'status-proses',
      agency: newReportData.agency || 'Dinas Bina Marga',
      reporterName: newReportData.reporterName || 'Andi Pratama',
      reporterEmail: newReportData.reporterEmail || 'andipratama@gmail.com',
      reporterPhone: newReportData.reporterPhone || '0812-3456-7890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: 't-1',
          title: 'Laporan diterima',
          description: 'Laporan berhasil dibuat dan masuk antrean sistem.',
          date: 'Hari ini - ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          actor: 'Masyarakat',
          status: 'completed'
        },
        {
          id: 't-2',
          title: 'Verifikasi petugas',
          description: 'Sedang ditinjau oleh staf operasional lapangan.',
          date: 'Hari ini',
          actor: 'Dinas Terkait',
          status: 'in-progress'
        }
      ],
      buktiTuntas: null
    };

    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return newReport;
  }

  updateReportStatus(reportId, status, officerNotes, photoAfterUrl = null) {
    const reports = this.getReports();
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) return null;

    const report = reports[reportIndex];
    report.status = status;
    report.updatedAt = new Date().toISOString();

    if (status === 'Selesai') {
      report.statusBadge = 'status-selesai';
      report.photoAfter = photoAfterUrl || report.photoAfter || 'assets/images/road_after.jpg';
      report.buktiTuntas = {
        isCompleted: true,
        completedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        officerName: 'Budi Santoso, S.T. (Petugas)',
        officerNip: '198403152009021004',
        workDuration: '2 Hari Kerja',
        contractor: 'Satgas Pemeliharaan Infrastruktur',
        notes: officerNotes || 'Pekerjaan perbaikan telah selesai 100% sesuai standar spesifikasi dinas.',
        citizenConfirmed: false,
        citizenRating: null,
        citizenFeedback: null
      };

      report.timeline.push({
        id: 't-' + Date.now(),
        title: 'Perbaikan Selesai (BuktiTuntas)',
        description: officerNotes || 'Perbaikan selesai dan dokumentasi bukti telah diunggah petugas.',
        date: 'Hari ini - ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        actor: 'Dinas PU',
        status: 'completed'
      });
    } else if (status === 'Dalam Proses') {
      report.statusBadge = 'status-proses';
      report.timeline.push({
        id: 't-' + Date.now(),
        title: 'Tindak lanjut lapangan',
        description: officerNotes || 'Tim teknis diterjunkan ke lokasi.',
        date: 'Hari ini',
        actor: 'Dinas PU',
        status: 'in-progress'
      });
    } else if (status === 'Tertunda') {
      report.statusBadge = 'status-tertunda';
      report.timeline.push({
        id: 't-' + Date.now(),
        title: 'Penundaan Sementara',
        description: officerNotes || 'Pekerjaan dijadwal ulang menunggu ketersediaan material.',
        date: 'Hari ini',
        actor: 'Dinas PU',
        status: 'delayed'
      });
    }

    reports[reportIndex] = report;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return report;
  }

  confirmBuktiTuntas(ticketCode, rating, feedback) {
    const reports = this.getReports();
    const reportIndex = reports.findIndex(r => r.ticketCode.toUpperCase() === ticketCode.toUpperCase().trim());
    if (reportIndex === -1) return null;

    const report = reports[reportIndex];
    if (report.buktiTuntas) {
      report.buktiTuntas.citizenConfirmed = true;
      report.buktiTuntas.citizenRating = rating || 5;
      report.buktiTuntas.citizenFeedback = feedback || 'Laporan dikonfirmasi selesai oleh warga.';
      
      report.timeline.push({
        id: 't-' + Date.now(),
        title: 'Konfirmasi Warga Diterima',
        description: `Warga memberikan rating ${rating} bintang: "${feedback || 'Hasil pekerjaan memuaskan'}"`,
        date: 'Hari ini - ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        actor: 'Masyarakat (Pelapor)',
        status: 'completed'
      });
    }

    reports[reportIndex] = report;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return report;
  }

  // User Profile API
  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  }

  saveCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  switchRole(role) {
    const user = this.getCurrentUser();
    if (role === 'petugas') {
      user.role = 'petugas';
      user.name = 'Budi Santoso, S.T.';
      user.email = 'budi.santoso@dinaspu.go.id';
      user.roleLabel = 'Petugas Dinas Bina Marga';
      user.agencyName = 'Dinas Bina Marga DKI Jakarta';
      user.avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
    } else {
      user.role = 'warga';
      user.name = 'Andi Pratama';
      user.email = 'andipratama@gmail.com';
      user.roleLabel = 'Masyarakat';
      user.agencyName = null;
      user.avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    }
    this.saveCurrentUser(user);
    return user;
  }

  // Complaints API
  getComplaints() {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return raw ? JSON.parse(raw) : INITIAL_COMPLAINTS;
  }

  addComplaint(data) {
    const list = this.getComplaints();
    const nextSeq = (list.length + 1).toString().padStart(4, '0');
    const newComplaint = {
      id: 'cmp-' + Date.now(),
      ticketCode: `PGD-2025-${nextSeq}`,
      category: data.category,
      agency: data.agency || 'Instansi Terkait',
      title: data.title,
      description: data.description,
      evidenceUrl: data.evidenceUrl || null,
      status: 'Diterima & Menunggu Verifikasi',
      createdAt: new Date().toISOString()
    };
    list.unshift(newComplaint);
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));
    return newComplaint;
  }

  // Permits API
  getPermits() {
    const raw = localStorage.getItem(STORAGE_KEYS.PERMITS);
    return raw ? JSON.parse(raw) : INITIAL_PERMITS;
  }

  addPermit(data) {
    const list = this.getPermits();
    const nextSeq = (list.length + 1).toString().padStart(4, '0');
    const newPermit = {
      id: 'pmt-' + Date.now(),
      ticketCode: `IZN-2025-${nextSeq}`,
      permitType: data.permitType,
      businessName: data.businessName,
      businessCategory: data.businessCategory,
      location: data.location,
      status: 'Pemeriksaan Berkas Administrasi',
      step: 1,
      createdAt: new Date().toISOString()
    };
    list.unshift(newPermit);
    localStorage.setItem(STORAGE_KEYS.PERMITS, JSON.stringify(list));
    return newPermit;
  }

  // Bansos API
  checkBansos(nikOrTicket) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BANSOS) || '[]');
    const cleaned = (nikOrTicket || '').trim();
    return list.find(b => b.nik === cleaned || b.programCode.toUpperCase() === cleaned.toUpperCase());
  }

  // Stats calculation
  getStatistics() {
    const reports = this.getReports();
    const total = reports.length;
    const dalamProses = reports.filter(r => r.status === 'Dalam Proses').length;
    const selesai = reports.filter(r => r.status === 'Selesai').length;
    const tertunda = reports.filter(r => r.status === 'Tertunda' || r.status === 'Menunggu').length;

    return {
      total: 12428 + total - INITIAL_REPORTS.length,
      dalamProses: 3842 + dalamProses - INITIAL_REPORTS.filter(r => r.status === 'Dalam Proses').length,
      selesai: 7421 + selesai - INITIAL_REPORTS.filter(r => r.status === 'Selesai').length,
      tertunda: 1165 + tertunda - INITIAL_REPORTS.filter(r => r.status === 'Tertunda' || r.status === 'Menunggu').length,
      satisfactionRate: '94.8%',
      avgResponseDays: '2.8 Hari'
    };
  }
}

// Global singleton instance
window.dataStore = new DataStore();
