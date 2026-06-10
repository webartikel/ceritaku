// ============================================
// CeritaKu — Login Page
// ============================================

import { loginAdmin } from '../firebase/auth.js';
import { isFirebaseConfigured } from '../firebase/firebase-config.js';
import { navigate } from '../utils/router.js';
import { setTitle } from '../utils/seo.js';
import { toast } from '../components/Toast.js';

export async function renderLogin(container) {
  setTitle('Login Admin');

  container.innerHTML = `
    <div class="login-page">
      <div class="hero-bg">
        <div class="hero-bg-grid"></div>
      </div>
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>

      <div class="login-card card card-glass animate-scale-in">
        <div class="card-body" style="padding:var(--space-10);">
          <div class="login-header">
            <div class="navbar-logo-icon" style="width:56px;height:56px;font-size:24px;margin:0 auto var(--space-5);">C</div>
            <h1 class="login-title">Selamat Datang</h1>
            <p class="login-subtitle">Masuk ke dashboard admin CeritaKu</p>
          </div>

          ${!isFirebaseConfigured() ? `
            <div style="padding:var(--space-4);background:var(--color-warning-light);color:var(--color-warning);border-radius:var(--radius-md);font-size:var(--text-sm);margin-bottom:var(--space-5);text-align:center;">
              <strong>Mode Demo</strong> — Firebase belum dikonfigurasi.<br/>
              Klik "Masuk" untuk masuk sebagai demo admin.
            </div>
          ` : ''}

          <div class="login-error" id="login-error"></div>

          <form class="login-form" id="login-form">
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input 
                type="email" 
                class="form-input" 
                id="email" 
                placeholder="admin@ceritaku.com"
                required
                autocomplete="email"
                ${!isFirebaseConfigured() ? 'value="admin@demo.com"' : ''}
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input 
                type="password" 
                class="form-input" 
                id="password" 
                placeholder="••••••••"
                required
                autocomplete="current-password"
                ${!isFirebaseConfigured() ? 'value="demo123"' : ''}
              />
            </div>

            <button type="submit" class="btn btn-primary btn-lg" id="login-btn" style="width:100%;margin-top:var(--space-2);">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              Masuk
            </button>
          </form>

          <p style="text-align:center;margin-top:var(--space-6);font-size:var(--text-sm);color:var(--color-text-tertiary);">
            <a href="#/" data-route="/" style="color:var(--color-text-tertiary);">← Kembali ke Beranda</a>
          </p>
        </div>
      </div>
    </div>
  `;

  // Form handler
  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      errorDiv.textContent = 'Email dan password harus diisi';
      errorDiv.classList.add('show');
      return;
    }

    // Demo mode
    if (!isFirebaseConfigured()) {
      toast.success('Login berhasil! (Mode Demo)');
      // Simulate auth state
      window.__demoAuth = true;
      navigate('/admin');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<div class="spinner"></div> Memproses...';
    errorDiv.classList.remove('show');

    try {
      await loginAdmin(email, password);
      toast.success('Login berhasil!');
      navigate('/admin');
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.classList.add('show');
      loginBtn.disabled = false;
      loginBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
        Masuk
      `;
    }
  });
}
