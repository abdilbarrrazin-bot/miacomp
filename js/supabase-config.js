/**
 * supabase-config.js
 * Konfigurasi Supabase Client & REST Service Controller
 * InfrastrukturKu - Portal Laporan Fasilitas Umum
 */

const SUPABASE_CONFIG = {
  // Masukkan kredensial proyek Supabase Anda di sini atau simpan via UI Pengaturan
  URL: localStorage.getItem('supabase_url') || 'https://xyzcompany.supabase.co',
  ANON_KEY: localStorage.getItem('supabase_anon_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_offline_and_mock_testing',
  STORAGE_BUCKET: 'infrastruktur-bukti'
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    this.initClient();
  }

  initClient() {
    try {
      if (window.supabase && SUPABASE_CONFIG.URL && !SUPABASE_CONFIG.URL.includes('xyzcompany')) {
        this.client = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
        this.isConfigured = true;
        console.log('✅ Supabase client successfully initialized.');
      } else {
        this.isConfigured = false;
        console.info('ℹ️ Supabase running in Mock & LocalStorage mode (ready for live API configuration).');
      }
    } catch (err) {
      console.warn('⚠️ Supabase init error, fallback to LocalStorage:', err);
      this.isConfigured = false;
    }
  }

  updateCredentials(url, anonKey) {
    SUPABASE_CONFIG.URL = url;
    SUPABASE_CONFIG.ANON_KEY = anonKey;
    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_anon_key', anonKey);
    this.initClient();
    return this.isConfigured;
  }

  /* ---------------- Auth Methods ---------------- */
  async signUp(email, password, fullName) {
    if (this.isConfigured && this.client) {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: 'warga' }
        }
      });
      if (error) throw error;
      return data;
    }
    // Fallback Mock
    const user = {
      id: 'usr-' + Date.now(),
      email,
      name: fullName,
      role: 'warga',
      roleLabel: 'Masyarakat',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    window.dataStore.saveCurrentUser(user);
    return { user };
  }

  async signIn(email, password) {
    if (this.isConfigured && this.client) {
      const { data, error } = await this.client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }
    // Fallback Mock
    let user = window.dataStore.getCurrentUser();
    if (email.includes('dinas') || email.includes('petugas')) {
      user = window.dataStore.switchRole('petugas');
    } else {
      user.email = email;
      window.dataStore.saveCurrentUser(user);
    }
    return { user };
  }

  async signOut() {
    if (this.isConfigured && this.client) {
      await this.client.auth.signOut();
    }
    return true;
  }

  /* ---------------- Reports Methods ---------------- */
  async fetchReports() {
    if (this.isConfigured && this.client) {
      const { data, error } = await this.client
        .from('reports')
        .select(`
          *,
          report_updates (*),
          bukti_tuntas (*)
        `)
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        return data;
      }
    }
    return window.dataStore.getReports();
  }

  async createReport(reportData) {
    if (this.isConfigured && this.client) {
      const { data, error } = await this.client
        .from('reports')
        .insert([{
          title: reportData.title,
          category: reportData.category,
          description: reportData.description,
          location_name: reportData.location,
          latitude: reportData.coords ? reportData.coords[0] : null,
          longitude: reportData.coords ? reportData.coords[1] : null,
          photo_before_url: reportData.photoBefore,
          status: 'Dalam Proses'
        }])
        .select();

      if (!error && data) {
        return data[0];
      }
    }
    return window.dataStore.addReport(reportData);
  }

  async updateReportStatus(reportId, status, notes, photoAfter) {
    if (this.isConfigured && this.client) {
      const { data, error } = await this.client
        .from('reports')
        .update({
          status: status,
          photo_after_url: photoAfter,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId)
        .select();

      if (!error) {
        await this.client.from('report_updates').insert([{
          report_id: reportId,
          status: status,
          note: notes,
          actor_name: 'Petugas Dinas PU'
        }]);
      }
    }
    return window.dataStore.updateReportStatus(reportId, status, notes, photoAfter);
  }

  async confirmCitizenReport(ticketCode, rating, feedback) {
    if (this.isConfigured && this.client) {
      await this.client
        .from('reports')
        .update({
          citizen_confirmed: true,
          citizen_rating: rating,
          citizen_feedback: feedback
        })
        .eq('ticket_code', ticketCode);
    }
    return window.dataStore.confirmBuktiTuntas(ticketCode, rating, feedback);
  }

  /* ---------------- File Storage Upload ---------------- */
  async uploadPhoto(file, folder = 'reports') {
    if (this.isConfigured && this.client) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data, error } = await this.client.storage
        .from(SUPABASE_CONFIG.STORAGE_BUCKET)
        .upload(fileName, file);

      if (!error && data) {
        const { data: publicUrlData } = this.client.storage
          .from(SUPABASE_CONFIG.STORAGE_BUCKET)
          .getPublicUrl(fileName);
        return publicUrlData.publicUrl;
      }
    }
    
    // In Browser Mock fallback: convert to base64 DataURL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }
}

// Global Supabase service instance
window.supabaseService = new SupabaseService();
