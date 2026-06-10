// ============================================
// CeritaKu — Firebase Configuration
// ============================================
// 
// PETUNJUK SETUP:
// 1. Buka https://console.firebase.google.com
// 2. Buat project baru atau gunakan yang sudah ada
// 3. Aktifkan Authentication (Email/Password)
// 4. Aktifkan Firestore Database
// 5. Salin konfigurasi Firebase ke bawah ini
// 6. Buat user admin di Firebase Console > Authentication > Add User
//
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

// ⚠️ GANTI DENGAN KONFIGURASI FIREBASE ANDA
const firebaseConfig = {
  apiKey: "AIzaSyDFNV_zErGlmZLBjNhrgPVloz7Tjg5X9z8",
  authDomain: "ceritaku-app-c91e7.firebaseapp.com",
  projectId: "ceritaku-app-c91e7",
  storageBucket: "ceritaku-app-c91e7.firebasestorage.app",
  messagingSenderId: "547939140950",
  appId: "1:547939140950:web:eb9cdee7da5ef77a2842f7"
};

// Initialize Firebase
let app = null;
let db = null;
let auth = null;
let firebaseReady = false;

export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== 'YOUR_API_KEY';
}

export function initFirebase() {
  if (firebaseReady) return { app, db, auth };
  
  if (!isFirebaseConfigured()) {
    console.warn('⚠️ Firebase belum dikonfigurasi. Silakan isi firebaseConfig di firebase-config.js');
    return { app: null, db: null, auth: null };
  }

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    firebaseReady = true;
    console.log('✅ Firebase berhasil diinisialisasi');
  } catch (error) {
    console.error('❌ Gagal menginisialisasi Firebase:', error);
  }

  return { app, db, auth };
}

export { app, db, auth };
