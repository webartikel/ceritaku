# CeritaKu — Personal Storytelling Platform

<div align="center">

![CeritaKu Logo](https://img.shields.io/badge/CeritaKu-2563EB?style=for-the-badge&logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHRleHQgeD0iNSIgeT0iMTgiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIj5DPC90ZXh0Pjwvc3ZnPg==)

**Platform modern untuk menulis, menyimpan, dan mempublikasikan cerita pribadi.**

[Demo](#demo) · [Fitur](#fitur) · [Instalasi](#instalasi) · [Deploy](#deploy-ke-github-pages)

</div>

---

## ✨ Fitur

- 🏠 **Landing Page** — Hero section fullscreen dengan animasi gradient
- 📚 **Daftar Cerita** — Grid modern dengan search & filter kategori
- 📖 **Detail Cerita** — Layout reading seperti Medium.com
- 🔐 **Admin Login** — Firebase Authentication
- 📊 **Dashboard Admin** — Statistik & manajemen cerita
- ✍️ **Editor Modern** — Rich text editor (Quill.js) dengan autosave
- 🌙 **Dark Mode** — Toggle dark/light mode
- 📱 **Responsive** — Mobile-first design
- 🎨 **Animasi** — Fade up, hover effects, smooth transitions
- 🔍 **SEO** — Dynamic meta tags, Open Graph, JSON-LD

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 / CSS3 / JavaScript (ES Modules) | Frontend |
| Firebase Firestore | Database |
| Firebase Authentication | Auth |
| Quill.js | Rich Text Editor |
| Google Fonts (Inter + Playfair Display) | Typography |
| GitHub Pages | Hosting |

## 📂 Struktur Project

```
WEBSITEARTIKEL/
├── index.html              # Entry point
├── robots.txt              # SEO
├── sitemap.xml             # SEO
├── firestore.rules         # Firebase security rules
├── README.md               # Dokumentasi ini
└── src/
    ├── app.js              # Main application
    ├── components/
    │   ├── Navbar.js       # Navigation bar
    │   ├── Footer.js       # Footer
    │   ├── StoryCard.js    # Story card component
    │   ├── Toast.js        # Toast notifications
    │   ├── Modal.js        # Modal dialog
    │   └── Skeleton.js     # Loading skeletons
    ├── pages/
    │   ├── Landing.js      # Home page
    │   ├── Stories.js      # Stories list
    │   ├── StoryDetail.js  # Story reader
    │   ├── About.js        # About page
    │   ├── Login.js        # Admin login
    │   ├── Dashboard.js    # Admin dashboard
    │   ├── Editor.js       # Story editor
    │   ├── ManageStories.js # Story management
    │   └── Settings.js     # Site settings
    ├── firebase/
    │   ├── firebase-config.js  # Firebase configuration
    │   ├── auth.js         # Authentication service
    │   └── firestore.js    # Database service + demo data
    ├── utils/
    │   ├── router.js       # SPA hash router
    │   ├── theme.js        # Dark/light mode manager
    │   ├── helpers.js      # Utility functions
    │   ├── seo.js          # Dynamic SEO manager
    │   └── animations.js   # Scroll animations
    └── styles/
        ├── variables.css   # Design tokens
        ├── base.css        # CSS reset & base
        ├── components.css  # Component styles
        ├── layout.css      # Layout system
        ├── animations.css  # Keyframes & animations
        ├── pages.css       # Page-specific styles
        └── dark-mode.css   # Dark mode overrides
```

## 🚀 Instalasi

### Mode Demo (Tanpa Firebase)

Website bisa langsung dijalankan **tanpa konfigurasi Firebase**. Data demo akan ditampilkan secara otomatis.

1. **Clone repository:**
   ```bash
   git clone https://github.com/username/WEBSITEARTIKEL.git
   cd WEBSITEARTIKEL
   ```

2. **Buka di browser:**
   - Jika menggunakan XAMPP: Akses `http://localhost/WEBSITEARTIKEL`
   - Atau gunakan Live Server (VS Code extension)
   - Atau jalankan: `npx serve .`

3. **Login Demo:**
   - Klik "Login Admin"
   - Langsung klik "Masuk" (email/password sudah terisi)

### Setup Firebase (Produksi)

1. **Buat project Firebase:**
   - Buka [Firebase Console](https://console.firebase.google.com)
   - Klik "Add Project" → ikuti langkah setup

2. **Aktifkan Authentication:**
   - Firebase Console → Authentication → Sign-in method
   - Aktifkan "Email/Password"
   - Tambahkan user admin: Authentication → Users → Add User

3. **Aktifkan Firestore:**
   - Firebase Console → Firestore Database → Create database
   - Pilih "Start in test mode" (update rules nanti)
   - Pilih region terdekat

4. **Salin konfigurasi:**
   - Firebase Console → Project Settings → General → Your apps → Web app
   - Klik "Add app" jika belum ada
   - Salin `firebaseConfig` object

5. **Update file konfigurasi:**
   
   Edit `src/firebase/firebase-config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

6. **Deploy security rules:**
   - Salin isi `firestore.rules` ke Firebase Console → Firestore → Rules

## 🌐 Deploy ke GitHub Pages

1. **Buat repository GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - CeritaKu"
   git branch -M main
   git remote add origin https://github.com/username/WEBSITEARTIKEL.git
   git push -u origin main
   ```

2. **Aktifkan GitHub Pages:**
   - Repository → Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Save

3. **Akses website:**
   ```
   https://username.github.io/WEBSITEARTIKEL/
   ```

4. **Update URL di file:**
   - Update `sitemap.xml` dengan domain GitHub Pages
   - Update `robots.txt` dengan URL sitemap yang benar

## 🎨 Kustomisasi

### Warna
Edit `src/styles/variables.css` untuk mengubah color palette:
```css
:root {
  --color-primary: #2563EB;     /* Warna utama */
  --color-secondary: #3B82F6;   /* Warna sekunder */
  --color-accent: #8B5CF6;      /* Warna aksen */
}
```

### Font
Edit link Google Fonts di `index.html` dan `--font-sans` / `--font-serif` di `variables.css`.

### Kategori
Edit array `CATEGORIES` di `src/utils/helpers.js`.

## 📄 Lisensi

MIT License — Bebas digunakan untuk proyek pribadi maupun komersial.

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk para pencerita</p>
</div>
