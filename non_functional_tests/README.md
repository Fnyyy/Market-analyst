# Sisvest Non-Functional Testing Suite

Dokumen ini berisi panduan lengkap untuk melakukan pengujian non-fungsional (Performance, Security, Accessibility, SEO) pada aplikasi Sisvest.

---

## 🛠️ Persiapan Awal (Prerequisites)

Sebelum menjalankan pengujian, instal tools berikut di komputer Windows Anda:

### 1. K6 (Load Testing)
Instal k6 menggunakan Windows Package Manager (Winget) lewat terminal (Command Prompt/PowerShell):
```bash
winget install gnu.k6
```
*Atau unduh installer resminya di [k6.io](https://k6.io/docs/getting-started/installation/).*

### 2. Python Packages (Security Scanning)
Pastikan Python & pip sudah terinstal. Instal library scanning dengan menjalankan perintah berikut:
```bash
# Instal Bandit (Static Application Security Testing)
pip install bandit

# Instal pip-audit (Dependency Scan untuk backend)
pip install pip-audit
```

---

## 🚀 Cara Menjalankan Pengujian

Anda dapat menjalankan seluruh pengujian melalui file master batch script:
1. Buka folder `non_functional_tests`.
2. Klik dua kali pada file **`run_all.bat`**.
3. Pilih menu yang diinginkan (1-6) untuk memulai testing.

---

## 📝 5 Jenis Pengujian yang Disediakan & Cara Membacanya

### 1. Performance / Load Testing (Menggunakan k6)
* **Script**: `performance_k6.js`
* **Cara Membaca Hasil**:
  * **`http_req_failed`**: Menunjukkan persentase request gagal (harus < 5% / `0.00%`).
  * **`http_req_duration`**: Menunjukkan waktu respon server. Nilai `p(95)` menunjukkan bahwa 95% request diselesaikan dalam waktu tertentu (target kita adalah di bawah `500ms`).
  * **`http_reqs`**: Jumlah total request per detik (RPS) yang mampu dilayani.

### 2. Static Security Scan - SAST (Menggunakan Bandit)
* **Script**: `security_bandit.bat`
* **Tujuan**: Memindai kode program backend untuk mencari celah keamanan.
* **Cara Membaca Hasil**:
  * Hasil scan akan dicatat ke file `bandit_report.txt`.
  * Cari bagian **"Run metrics"** di bagian akhir. Jika ada temuan berlevel *Medium* atau *High*, segera periksa baris kode yang ditunjuk untuk diperbaiki.

### 3. Dependency Vulnerability Audit (npm audit & pip-audit)
* **Script**: `security_audit.bat`
* **Tujuan**: Memeriksa apakah library npm (React) atau pip (FastAPI) yang digunakan memiliki celah keamanan.
* **Cara Membaca Hasil**:
  * **npm audit**: Menampilkan laporan kerentanan *Critical, High, Moderate, Low* untuk pustaka React. Jalankan `npm audit fix` di folder `frontend` untuk memperbaiki otomatis jika ada celah.
  * **pip-audit**: Menampilkan vulnerability database (CVE) dari dependensi Python di `backend/requirements.txt`.

### 4. UI Performance & SEO (Menggunakan Google Lighthouse)
* **Cara Menjalankan**:
  1. Jalankan aplikasi Sisvest frontend (`http://localhost:5173`).
  2. Klik kanan di halaman utama -> pilih **Inspect** -> tab **Lighthouse**.
  3. Pilih **Navigation (Default)**, lalu klik **Analyze page load**.
* **Cara Membaca Hasil**:
  * Anda akan mendapat 4 skor utama (Performance, Accessibility, Best Practices, SEO) dari `0-100`.
  * Gulir ke bawah untuk melihat saran optimasi (seperti kompresi gambar, penambahan tag meta, dll.).

### 5. Web Accessibility Audit - A11y (Menggunakan axe DevTools)
* **Cara Menjalankan**:
  1. Instal ekstensi **axe DevTools** dari Chrome Web Store.
  2. Buka aplikasi Sisvest -> buka **Inspect** (F12) -> pilih tab **axe DevTools**.
  3. Klik **Scan all of my page**.
* **Cara Membaca Hasil**:
  * Menampilkan pelanggaran standar aksesibilitas WCAG (misal kontras teks kurang jelas, tombol tidak memiliki label aria, atau gambar tanpa tag `alt`).
  * Ini sangat cocok dimasukkan sebagai bab laporan Pengujian Non-Fungsional.
