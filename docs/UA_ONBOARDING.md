# Project Onboarding Guide: Simulator BM (New Program)

Selamat datang di proyek **Simulator BM (New Program)**! Panduan ini dirancang untuk memberikan pemahaman menyeluruh tentang arsitektur, cara kerja simulator ujian berbasis chat WhatsApp ini, serta panduan implementasi untuk memperbarui profil karakter calon siswa (*leads*) dan template pesan baru.

---

## 1. Project Overview

- **Nama Proyek:** `simulator-bm`
- **Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Integrasi Eksternal:** Google Sheets API v4 (Google APIs Client Library)
- **Tujuan Sistem:**
  Simulator interaktif berbasis tampilan chat WhatsApp untuk menguji calon **Booking Manager (Admission Executive)** RevoU. Kandidat menghadapi sesi simulasi bertahap dengan calon siswa (*lead*) yang memiliki karakteristik, program minat, dan latar belakang berbeda. Setiap sesi memiliki batas waktu (20 menit) dan aturan respon *single bubble*. Di akhir simulasi, seluruh transkrip chat beserta waktu respon dicatat dan dikirimkan otomatis ke Google Spreadsheet.

---

## 2. Architecture Layers

Proyek ini dibangun dengan struktur modular berbasis Next.js App Router:

```
src/
├── app/                  # App Router Pages & API Route Handlers
│   ├── page.tsx          # 1. Halaman Registrasi Kandidat
│   ├── instructions/     # 2. Panduan & Aturan Ujian
│   ├── exam/             # 3. Simulator Chat WhatsApp (Main Screen)
│   ├── thankyou/         # 4. Ringkasan & Hasil Akhir Ujian
│   └── api/
│       ├── submit/       # POST Endpoint simpan transkrip ke Google Sheets
│       └── test-sheets/  # GET Endpoint verifikasi integrasi Google Sheets
├── components/           # Komponen UI Bergaya WhatsApp
│   ├── ChatBubble.tsx    # Balon chat hijau (BM) & putih (Lead)
│   ├── ChatHeader.tsx    # Header WhatsApp, avatar, subtitle & Timer pill
│   ├── ChatInput.tsx     # Input bar textarea auto-grow + send button
│   ├── Timer.tsx         # Countdown timer lingkaran SVG + alert warna
│   └── TypingIndicator.tsx # Animasi 3 titik ketika Lead sedang mengetik
├── data/
│   └── leads.ts          # Dataset profil lead, opening message, Q&A, objections
├── lib/
│   ├── examEngine.ts     # Core State Machine simulasi ujian
│   ├── googleSheets.ts   # Formatting transkrip & pengiriman baris Sheets
│   ├── shuffle.ts        # Pengacakan urutan pertanyaan & keberatan
│   └── storage.ts        # Sinkronisasi ExamState ke LocalStorage
└── types/
    └── index.ts          # Definisi TypeScript interface & types
```

---

## 3. Key Concepts & Flow Simulasi

### 3.1. Siklus Hidup Ujian (State Machine)
Siklus ujian diatur melalui state `ExamState` di `src/lib/examEngine.ts`:
1. **Pendaftaran (`/`)**: Kandidat memasukkan Nama & Email. Sistem membuat state baru via `createInitialState()`.
2. **Instruksi (`/instructions`)**: Kandidat membaca peran, profil lead, dan aturan 1 bubble chat.
3. **Simulasi Sesi per Lead (`/exam`)**:
   - **Greeting Phase**: Pop-up konfirmasi muncul. Setelah kandidat klik "Mulai", timer 20 menit berjalan. Pesan pembuka BM (Message 1) dan balasan Lead (Message 2) ditampilkan secara bertahap dengan animasi mengetik.
   - **Questions & Objections Phase**: Kandidat membalas pesan. Engine mengirimkan 3 pertanyaan program (acak) dilanjutkan dengan 2 keberatan (acak) menggunakan algoritma Fisher-Yates (`src/lib/shuffle.ts`).
   - **Booking Request Phase**: Setelah ke-5 poin terjawab, lead mengajukan permintaan booking sesi konsultasi dengan AC.
   - **Booking Confirm Phase**: Kandidat mengonfirmasi waktu/jadwal, lead memberikan konfirmasi penutup. Sesi selesai (`booked`).
   - **Timeout Handling**: Jika waktu 20 menit habis sebelum booking selesai, sesi ditutup otomatis dengan status `timeout`.
   - **Transisi Antar Sesi**: Sistem berpindah ke lead berikutnya dengan animasi transisi geser horizontal.
4. **Pengiriman Hasil (`/thankyou`)**: Semua transkrip dari seluruh sesi digabungkan dan dikirim ke Google Sheets via `/api/submit`.

---

## 4. Analisis Hotspots & Penyesuaian Program Baru

Untuk menerapkan profil dan pesan baru sesuai dokumen acuan, berikut area yang perlu diperbarui:

### A. Dataset Karakter Baru (`src/data/leads.ts`)
Mengganti 3 profil lama (Rina, Dimas, Shania) menjadi 4 profil baru:
1. **Aliya (24)**: Staff Marketing di perusahaan otomotif Jepang | Sumber: *Application form* | Program: *Applied AI Analytics & Automation RevoU x BINUS*
2. **Tomo (40)**: Kepala sekolah di sekolah swasta di Jakarta Selatan | Sumber: *Brochure download* | Program: *Data-Driven Decision Making for Leaders RevoU x ITB*
3. **Burhan (32)**: Credit Analyst di perusahaan e-wallet | Sumber: *Application form* | Program: *Applied Data Science with AI RevoU x ITB*
4. **Ika (30)**: Account Payable di kantor udh 5th, kantor retail | Sumber: *Brochure download* | Program: *AI-Enabled Strategic Finance RevoU x UI*

### B. Template Pesan Awal (Message 1 & Message 2)
Masing-masing lead memiliki teks pembuka BM (*Message 1: Admission Executive*) dan respon awal lead (*Message 2: Lead*) yang telah ditentukan secara spesifik dalam dokumen.

### C. Pertanyaan & Keberatan (3 Questions + 2 Objections)
Masing-masing lead memiliki 3 pertanyaan kurikulum/program dan 2 *objections* (biaya, waktu/shift kerja, izin ortu, perbandingan dengan sertifikasi lain, dll).

### D. Penyesuaian Skalabilitas Lead (3 → 4 Leads)
- `src/lib/examEngine.ts`: Mengubah inisialisasi `sectionEndReasons` agar dinamis (`leads.map(() => null)`).
- `src/lib/googleSheets.ts`: Menyesuaikan header kolom Google Sheets untuk menampung 4 sesi (Aliya, Tomo, Burhan, Ika) dan format row dinamis.
- `src/app/instructions/page.tsx`: Memperbarui deskripsi profil 4 lead dan program baru.
- `src/app/exam/page.tsx`: Mengubah label counter `x/3` menjadi dinamis `x/${leads.length}`.

---

## 5. Status Keamanan Eksekusi
Sesuai instruksi pengguna: **Tidak ada kode atau server lokal yang dijalankan sebelum disetujui**.
Panduan implementasi dan mapping detail telah dipersiapkan dan menunggu konfirmasi Anda untuk diterapkan.
