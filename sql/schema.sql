-- SKEMA BASIS DATA SUPABASE (POSTGRESQL) - INFRASTRUKTURKU
-- "Lapor Masalahnya. Pantau Prosesnya. Buktikan Hasilnya."

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('warga', 'petugas', 'admin');
CREATE TYPE report_status AS ENUM ('Menunggu', 'Dalam Proses', 'Selesai', 'Tertunda');
CREATE TYPE report_category AS ENUM ('Jalan', 'Lampu', 'Drainase', 'Fasilitas', 'Lainnya');
CREATE TYPE permit_status AS ENUM ('Verifikasi Berkas', 'Tinjau Lapangan', 'Penerbitan SK', 'Ditolak');

-- 3. PROFILES TABLE (Terkoneksi dengan auth.users Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    nik VARCHAR(16) UNIQUE,
    address TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'warga'::user_role,
    agency_name VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REPORTS TABLE (Laporan Fasilitas Umum & Kerusakan)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    category report_category DEFAULT 'Jalan'::report_category,
    description TEXT NOT NULL,
    location_name TEXT NOT NULL,
    city VARCHAR(100) DEFAULT 'DKI Jakarta',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    photo_before_url TEXT NOT NULL,
    photo_after_url TEXT,
    status report_status DEFAULT 'Dalam Proses'::report_status,
    agency_assigned VARCHAR(150) DEFAULT 'Dinas Bina Marga',
    -- BuktiTuntas & Citizen Confirmation Fields
    work_notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    contractor_name VARCHAR(150),
    officer_in_charge VARCHAR(150),
    citizen_confirmed BOOLEAN DEFAULT FALSE,
    citizen_rating SMALLINT CHECK (citizen_rating >= 1 AND citizen_rating <= 5),
    citizen_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. REPORT UPDATES & TIMELINE (Riwayat Penanganan Laporan)
CREATE TABLE IF NOT EXISTS public.report_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(100) DEFAULT 'Dinas Terkait',
    step_status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. COMPLAINTS TABLE (Pengaduan Pelayanan Publik / Birokrasi)
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category VARCHAR(150) NOT NULL,
    agency_name VARCHAR(150) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    evidence_url TEXT,
    status VARCHAR(50) DEFAULT 'Dalam Investigasi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. PERMITS TABLE (Layanan Perizinan Online)
CREATE TABLE IF NOT EXISTS public.permits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    permit_type VARCHAR(100) NOT NULL,
    business_name VARCHAR(150) NOT NULL,
    business_category VARCHAR(100) NOT NULL,
    location TEXT NOT NULL,
    document_url TEXT,
    status permit_status DEFAULT 'Verifikasi Berkas'::permit_status,
    current_step SMALLINT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. BANSOS TABLE (Bantuan Sosial & Cek NIK)
CREATE TABLE IF NOT EXISTS public.bansos_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nik VARCHAR(16) NOT NULL,
    applicant_name VARCHAR(150) NOT NULL,
    program_name VARCHAR(100) NOT NULL,
    program_code VARCHAR(20) NOT NULL,
    nominal VARCHAR(50) NOT NULL,
    batch VARCHAR(100) NOT NULL,
    distribution_point TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bansos_submissions ENABLE ROW LEVEL SECURITY;

-- Reports: Publik bebas melihat (Transparansi Publik), Warga hanya mengedit milik sendiri, Petugas bisa update
CREATE POLICY "Laporan dapat dilihat publik" ON public.reports
    FOR SELECT USING (true);

CREATE POLICY "Masyarakat dapat membuat laporan" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Petugas dapat memperbarui status laporan" ON public.reports
    FOR UPDATE USING (true);

CREATE POLICY "Updates dapat dilihat publik" ON public.report_updates
    FOR SELECT USING (true);

CREATE POLICY "Bansos status dapat dicek berdasarkan NIK" ON public.bansos_submissions
    FOR SELECT USING (true);

-- 10. STORAGE BUCKET CONFIGURATION (Untuk Bukti Foto Kerusakan & BuktiTuntas)
-- Eksekusi di Supabase Dashboard -> Storage -> Create Bucket: 'infrastruktur-bukti' (Public)
/*
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('infrastruktur-bukti', 'infrastruktur-bukti', true);

  CREATE POLICY "Public Read Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'infrastruktur-bukti');

  CREATE POLICY "Authenticated Users Upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'infrastruktur-bukti');
*/

-- 11. CONTOH SEED DATA AWAL
INSERT INTO public.reports (
    ticket_code, title, category, description, location_name, city, latitude, longitude,
    photo_before_url, photo_after_url, status, agency_assigned, citizen_confirmed, citizen_rating, citizen_feedback
) VALUES
(
    'INF-2025-0012',
    'Jalan rusak di Jl. Melati',
    'Jalan',
    'Terdapat lubang cukup besar di tengah jalan yang membahayakan pengendara motor.',
    'Jl. Melati No. 14, Menteng, Jakarta Pusat',
    'Jakarta Pusat',
    -6.1895, 106.8322,
    'assets/images/road_before.jpg',
    'assets/images/road_after.jpg',
    'Selesai',
    'Dinas Bina Marga DKI Jakarta',
    true,
    5,
    'Pengerjaan sangat cepat dan aspal mulus kembali! Terima kasih Dinas Bina Marga.'
),
(
    'INF-2025-0011',
    'Lampu jalan mati di perempatan',
    'Lampu',
    'Tiga titik lampu PJU mati total sejak 5 hari yang lalu, lokasi sangat gelap.',
    'Jl. Kaliurang KM 9, Sleman',
    'Kab. Sleman',
    -7.7325, 110.3956,
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    null,
    'Menunggu',
    'Dinas Perhubungan Sleman',
    false,
    null,
    null
),
(
    'INF-2025-0010',
    'Drainase tersumbat sampah & lumpur',
    'Drainase',
    'Saluran air tertimbun endapan lumpur tebal sehingga air meluap ke badan jalan.',
    'Jl. Darmo No. 88, Wonokromo, Surabaya',
    'Kota Surabaya',
    -7.2912, 112.7381,
    'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    'Selesai',
    'Dinas Sumber Daya Air Surabaya',
    true,
    4,
    'Bagus dan cepat tanggap, saluran kembali lancar.'
);
