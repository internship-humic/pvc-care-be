<div align="center">

# 🩺 PVC Care — Backend API

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](https://opensource.org/licenses/ISC)

**RESTful API backend** untuk aplikasi **PVC Care** — platform manajemen pemindaian (scan) PVC berbasis AI yang menghubungkan pasien, dokter, dan administrator dalam satu ekosistem terintegrasi.

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Tech Stack & Prasyarat](#-tech-stack--prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Cara Menjalankan](#-cara-menjalankan)
- [Database Migration & Seeding](#-database-migration--seeding)
- [Struktur Proyek](#-struktur-proyek)
- [API Endpoints](#-api-endpoints)
- [Testing & Linting](#-testing--linting)
- [Pemecahan Masalah Umum](#-pemecahan-masalah-umum)

---

## 🩻 Tentang Proyek

**PVC Care Backend** adalah layanan API yang mendukung aplikasi manajemen kesehatan untuk analisis dan verifikasi hasil scan PVC (Premature Ventricular Contraction). Sistem ini memungkinkan:

- 🔐 **Autentikasi & Otorisasi** berbasis JWT dengan tiga peran: `Admin`, `Doctor`, dan `Patient`
- 📁 **Manajemen Scan PVC** — pasien dapat mengunggah dokumen scan, AI memproses hasilnya, dan dokter melakukan verifikasi akhir
- 👨‍⚕️ **Manajemen Profil Dokter** dengan sistem verifikasi oleh admin
- 🔔 **Sistem Notifikasi** real-time untuk setiap perubahan status scan dan verifikasi

---

## 🛠️ Tech Stack & Prasyarat

Pastikan semua perangkat lunak berikut telah terpasang di sistem Anda sebelum memulai.

| Teknologi | Versi Minimum | Keterangan |
|---|---|---|
| [Node.js](https://nodejs.org/) | `v18.x` atau lebih baru | JavaScript Runtime |
| [npm](https://www.npmjs.com/) | `v9.x` atau lebih baru | Package manager (sudah termasuk dalam Node.js) |
| [PostgreSQL](https://www.postgresql.org/) | `v14.x` atau lebih baru | Database utama |
| [PostGIS](https://postgis.net/) | `v3.x` | Ekstensi spasial untuk PostgreSQL (**wajib diaktifkan**) |
| [Git](https://git-scm.com/) | Versi terbaru | Version control |

> [!IMPORTANT]
> Proyek ini menggunakan **PostgreSQL dengan ekstensi PostGIS**. Pastikan ekstensi `postgis` sudah terpasang dan aktif di database Anda sebelum menjalankan migrasi.

---

## ⚙️ Instalasi & Setup

Ikuti langkah-langkah berikut secara berurutan.

### Langkah 1 — Clone Repositori

```bash
git clone https://github.com/<username>/pvc-care-be.git
cd pvc-care-be
```

### Langkah 2 — Instalasi Dependencies

```bash
npm install
```

### Langkah 3 — Konfigurasi Environment Variables

Salin file contoh `.env.example` menjadi file `.env`:

```bash
# Linux / macOS
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Kemudian buka file `.env` dan sesuaikan nilainya:

```env
# .env

# Port server (opsional, default: 3000)
PORT=3000

# Koneksi database PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/NAMA_DATABASE?schema=public"

# Secret key untuk JWT (gunakan string acak yang panjang)
JWT_SECRET="ganti_dengan_secret_key_yang_sangat_panjang_dan_acak"
JWT_EXPIRES_IN="7d"
```

> [!TIP]
> Untuk menghasilkan `JWT_SECRET` yang kuat, Anda dapat menjalankan perintah berikut di terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Langkah 4 — Aktifkan Ekstensi PostGIS di Database

Pastikan Anda sudah masuk ke konsol PostgreSQL dan aktifkan ekstensi PostGIS:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Langkah 5 — Jalankan Migrasi Database

```bash
npx prisma migrate deploy
```

Perintah ini akan menerapkan semua migrasi yang tersedia ke database Anda.

### Langkah 6 — Generate Prisma Client

```bash
npx prisma generate
```

---

## ▶️ Cara Menjalankan

### Mode Development

Mode ini menggunakan `nodemon` untuk me-restart server secara otomatis setiap ada perubahan file.

```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000` (atau port yang dikonfigurasi di `.env`)

### Mode Production

```bash
npm start
```

---

## 🌱 Database Migration & Seeding

### Menjalankan Migrasi Baru (Development)

Gunakan perintah berikut saat membuat perubahan pada `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name <nama_migrasi>
```

### Melihat Status Migrasi

```bash
npx prisma migrate status
```

### Membuka Prisma Studio (GUI Database)

```bash
npx prisma studio
```

---

### Seeding Data

Proyek ini menyediakan tiga seeder untuk data awal.

#### 🔑 Seeder Admin

Membuat akun administrator pertama. Argumen `email` dan `password` wajib disertakan.

```bash
npm run seed:admin <email> <password>

# Contoh:
npm run seed:admin admin@pvccare.com Admin123!
```

#### 👨‍⚕️ Seeder Dokter

Membuat data dokter sampel untuk keperluan pengembangan.

```bash
npm run seed:doctor
```

#### 🔔 Seeder Notifikasi

Membuat data notifikasi sampel.

```bash
npm run seed:notification
```

---

## 📁 Struktur Proyek

```
pvc-care-be/
├── prisma/
│   ├── migrations/          # Riwayat semua migrasi database
│   └── schema.prisma        # Definisi skema database (model & relasi)
│
├── public/
│   └── images/              # Penyimpanan file gambar yang diunggah (diabaikan Git)
│
├── src/
│   ├── common/
│   │   ├── base_classes/    # Kelas dasar (BaseError, BaseSeeder, dll.)
│   │   ├── enums/           # Definisi konstanta enum (roles, status, dll.)
│   │   └── services/        # Layanan umum yang dapat digunakan ulang
│   │
│   ├── domains/             # Modul fitur utama (Domain-Driven Design)
│   │   ├── auth/            # Autentikasi (register, login)
│   │   ├── doctor-profile/  # Manajemen profil & verifikasi dokter
│   │   ├── notification/    # Sistem notifikasi pengguna
│   │   ├── patient-profile/ # Manajemen profil pasien
│   │   └── pvc-scan/        # Manajemen scan PVC (upload, AI result, verifikasi)
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js            # Verifikasi JWT & otorisasi peran
│   │   ├── error.middleware.js           # Penanganan error terpusat
│   │   └── request-validator.middleware.js # Validasi request body (Joi)
│   │
│   ├── utils/
│   │   ├── seeders/         # Skrip seeding data
│   │   ├── auth.util.js     # Helper autentikasi (hash password, dll.)
│   │   ├── image.util.js    # Helper upload & manajemen gambar (Multer)
│   │   ├── logger.util.js   # Konfigurasi logger (Winston)
│   │   ├── make-domain.util.js # CLI generator struktur domain baru
│   │   └── pagination.util.js  # Helper untuk paginasi query
│   │
│   ├── app.js               # Konfigurasi utama Express (middleware, routes, CORS)
│   ├── routes.js            # Pendaftaran semua route utama API
│   └── server.js            # Entry point aplikasi
│
├── .env                     # Variabel lingkungan lokal (TIDAK di-commit ke Git)
├── .env.example             # Contoh template variabel lingkungan
├── .gitignore
└── package.json
```

---

## 🌐 API Endpoints

Semua endpoint API diawali dengan prefix `/api`.

| Modul | Base Path | Deskripsi |
|---|---|---|
| Autentikasi | `/api/auth` | Register, Login |
| Profil Pasien | `/api/patient-profile` | CRUD profil pasien |
| Profil Dokter | `/api/doctor-profile` | CRUD & verifikasi profil dokter |
| Scan PVC | `/api/pvc-scans` | Upload, list, detail, dan verifikasi scan |
| Notifikasi | `/api/notifications` | List & baca notifikasi pengguna |
| File Statis | `/images/*` | Akses file gambar yang diunggah |

---

## 🧪 Testing & Linting

> [!NOTE]
> Saat ini proyek belum memiliki suite pengujian otomatis. Berikut adalah perintah yang tersedia.

```bash
# Menjalankan test (placeholder — belum dikonfigurasi)
npm test

# Memeriksa format kode dengan Prettier (jika dikonfigurasi)
npx prettier --check .

# Memperbaiki format kode secara otomatis
npx prettier --write .
```

Untuk pengujian API secara manual, disarankan menggunakan tools seperti:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Bruno](https://www.usebruno.com/)

---

## 🚨 Pemecahan Masalah Umum

### 1. Error: `Can't reach database server` saat menjalankan migrasi

**Gejala:**
```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Penyebab:** Konfigurasi `DATABASE_URL` di file `.env` tidak tepat, atau server PostgreSQL belum berjalan.

**Solusi:**
```bash
# 1. Pastikan PostgreSQL aktif
# Linux/macOS:
sudo service postgresql start

# Windows (PowerShell sebagai Administrator):
Start-Service postgresql-x64-16  # Sesuaikan versi

# 2. Verifikasi koneksi database secara manual
psql -U postgres -h localhost -p 5432 -d pvc_care_db

# 3. Periksa kembali format DATABASE_URL di .env:
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

---

### 2. Error: `Extension "postgis" is not available` saat migrasi

**Gejala:**
```
ERROR: could not open extension control file ".../postgis.control": No such file or directory
```

**Penyebab:** Ekstensi PostGIS belum terpasang di sistem atau belum diaktifkan di database.

**Solusi:**

```bash
# Ubuntu/Debian — Install PostGIS
sudo apt install postgresql-16-postgis-3  # Sesuaikan versi PostgreSQL

# macOS (Homebrew)
brew install postgis

# Setelah terpasang, aktifkan ekstensi di database Anda
psql -U postgres -d pvc_care_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

> [!TIP]
> Jika menggunakan layanan cloud (misalnya Supabase, Neon, atau AWS RDS), ekstensi PostGIS biasanya sudah tersedia dan dapat diaktifkan langsung dari dashboard atau dengan menjalankan query SQL di atas.

---

<div align="center">

Dibuat dengan ❤️ sebagai bagian dari program **Magang Humic Engineering**

</div>
