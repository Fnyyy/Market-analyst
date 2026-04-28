# Panduan Menjalankan Aplikasi Sisvest (Backend & Frontend)

Panduan ini akan membantu Anda dan teman-teman untuk memasang dan menjalankan aplikasi **Sisvest** dari awal di komputer masing-masing.

---

## 🛠️ Persyaratan Awal (Prerequisites)

Pastikan komputer Anda sudah terpasang:
1. **Node.js** (Rekomendasi versi 18 ke atas) -> [Unduh Node.js](https://nodejs.org/)
2. **Python** (Rekomendasi versi 3.10 ke atas) -> [Unduh Python](https://www.python.org/)

---

## 💻 Langkah 1: Setup & Menjalankan Backend (FastAPI)

Backend mengurus pengolahan data saham, prediksi AI, analisis fundamental, watchlist, portofolio, dan autentikasi pengguna.

1. Buka terminal (Command Prompt / PowerShell / Terminal VS Code).
2. Arahkan ke dalam direktori/folder `backend`:
   ```bash
   cd backend
   ```
3. Buatlah virtual environment (lingkungan virtual Python) baru agar dependensi tidak bentrok dengan sistem global Anda:
   ```bash
   python -m venv venv
   ```
4. Aktifkan virtual environment tersebut:
   - **Windows (PowerShell / CMD):**
     ```powershell
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     source venv/bin/activate
     ```
5. Install semua dependensi Python yang dibutuhkan:
   ```bash
   pip install -r requirements.txt
   ```
6. Jalankan server backend:
   ```bash
   python main.py
   ```
   > 💡 *Server backend sekarang berjalan di alamat **http://localhost:8000**.*
   > *Database SQLite (`fintech.db`) akan terbuat secara otomatis di dalam folder `backend` saat pertama kali dijalankan.*

---

## 🎨 Langkah 2: Setup & Menjalankan Frontend (React + Vite + Tailwind)

Frontend adalah antarmuka web interaktif tempat pengguna melihat dashboard, watchlist, portfolio, dan membaca modul pembelajaran.

1. Buka terminal baru (jangan matikan terminal backend).
2. Arahkan ke dalam direktori/folder `frontend`:
   ```bash
   cd frontend
   ```
3. Install seluruh paket/dependensi Node.js yang diperlukan:
   ```bash
   npm install
   ```
4. Jalankan server pengembangan (development server):
   ```bash
   npm run dev
   ```
   > 💡 *Aplikasi web sekarang berjalan di alamat **http://localhost:5173**.*
   > *Buka peramban (browser) Anda dan akses alamat tersebut untuk masuk ke aplikasi.*

---

## 🔑 Informasi Akun Bawaan (Default Accounts)

Ketika server backend pertama kali dijalankan, sistem secara otomatis memasukkan beberapa akun siap pakai ke dalam database. Gunakan akun berikut untuk masuk:

| Role / Tipe Akun | Username | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` |
| **Investor Premium** | `investor_pro` | `password123` |
| **Investor Standard (AI)** | `testuser_ai` | `password123` |

---

## 🔍 Tips & Troubleshooting

- **Grafik Saham / Data Kosong:** Pastikan server backend (`localhost:8000`) sudah menyala. Jika backend mati, frontend tidak akan bisa menarik data pasar saham real-time dan analisis AI.
- **Port Bentrok (Port in Use):** Pastikan port `8000` (untuk backend) dan `5173` (untuk frontend) tidak sedang dipakai oleh aplikasi lain.
- **Keluar dari Virtual Environment Python:** Jika sudah selesai menggunakan backend, Anda dapat mengetik `deactivate` di terminal backend untuk menonaktifkannya.

- DevLog: commit 52 - documentation updates

- DevLog: commit 59 - documentation updates

- DevLog: commit 66 - documentation updates

- DevLog: commit 73 - documentation updates

- DevLog: commit 80 - documentation updates

- DevLog: commit 87 - documentation updates

- DevLog: commit 94 - documentation updates

- DevLog: commit 101 - documentation updates

- DevLog: commit 108 - documentation updates

- DevLog: commit 115 - documentation updates

- DevLog: commit 122 - documentation updates

- DevLog: commit 129 - documentation updates

- DevLog: commit 136 - documentation updates
