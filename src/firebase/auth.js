// ============================================
// CeritaKu — Firebase Authentication
// ============================================

import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { auth } from './firebase-config.js';
import { isFirebaseConfigured } from './firebase-config.js';

let currentUser = null;
let authListeners = [];

/**
 * Login admin user
 */
export async function loginAdmin(email, password) {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase belum dikonfigurasi');
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    currentUser = userCredential.user;
    return currentUser;
  } catch (error) {
    let message = 'Login gagal';
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Format email tidak valid';
        break;
      case 'auth/user-not-found':
        message = 'Akun tidak ditemukan';
        break;
      case 'auth/wrong-password':
        message = 'Password salah';
        break;
      case 'auth/invalid-credential':
        message = 'Email atau password salah';
        break;
      case 'auth/too-many-requests':
        message = 'Terlalu banyak percobaan. Coba lagi nanti';
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
}

/**
 * Logout admin
 */
export async function logoutAdmin() {
  sessionStorage.removeItem('demoAuth');
  if (!auth) return;
  try {
    await signOut(auth);
    currentUser = null;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback) {
  authListeners.push(callback);

  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return () => {};
  }

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    currentUser = user;
    authListeners.forEach(cb => cb(user));
  });

  return () => {
    unsubscribe();
    authListeners = authListeners.filter(cb => cb !== callback);
  };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return currentUser !== null || sessionStorage.getItem('demoAuth') === 'true';
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return currentUser;
}
