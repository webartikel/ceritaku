// ============================================
// CeritaKu — Navbar Component
// ============================================

import { toggleTheme, getTheme } from '../utils/theme.js';
import { isAuthenticated, logoutAdmin } from '../firebase/auth.js';
import { navigate } from '../utils/router.js';

export function renderNavbar() {
  const isLoggedIn = isAuthenticated();
  const currentHash = window.location.hash.slice(1) || '/';

  const isActive = (path) => {
    if (path === '/' && currentHash === '/') return 'active';
    if (path !== '/' && currentHash.startsWith(path)) return 'active';
    return '';
  };

  return `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a href="#/" class="navbar-logo" data-route="/">
          <div class="navbar-logo-icon">C</div>
          <span>CeritaKu</span>
        </a>

        <div class="navbar-links" id="navbar-links">
          <a href="#/" class="navbar-link ${isActive('/')}" data-route="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Beranda
          </a>
          <a href="#/stories" class="navbar-link ${isActive('/stories')}" data-route="/stories">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            Cerita
          </a>
          <a href="#/about" class="navbar-link ${isActive('/about')}" data-route="/about">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Tentang
          </a>
          ${isLoggedIn ? `
            <a href="#/admin" class="navbar-link ${isActive('/admin')}" data-route="/admin">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>
              Dashboard
            </a>
          ` : `
            <a href="#/login" class="navbar-link ${isActive('/login')}" data-route="/login">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              Login Admin
            </a>
          `}
        </div>

        <div class="navbar-actions">
          <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
            ${getTheme() === 'dark' 
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
            }
          </button>

          ${isLoggedIn ? `
            <button class="btn btn-ghost btn-sm" id="logout-btn" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
          ` : ''}

          <button class="navbar-mobile-toggle" id="mobile-toggle" aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" id="mobile-menu">
        <a href="#/" class="navbar-link ${isActive('/')}" data-route="/">Beranda</a>
        <a href="#/stories" class="navbar-link ${isActive('/stories')}" data-route="/stories">Cerita</a>
        <a href="#/about" class="navbar-link ${isActive('/about')}" data-route="/about">Tentang</a>
        ${isLoggedIn 
          ? `
            <div class="mobile-menu-divider"></div>
            <span class="mobile-menu-section">Admin</span>
            <a href="#/admin" class="navbar-link ${isActive('/admin')}" data-route="/admin">Dashboard</a>
            <a href="#/admin/editor" class="navbar-link ${isActive('/admin/editor')}" data-route="/admin/editor">Buat Cerita</a>
            <a href="#/admin/manage" class="navbar-link ${isActive('/admin/manage')}" data-route="/admin/manage">Kelola Cerita</a>
            <a href="#/admin/categories" class="navbar-link ${isActive('/admin/categories')}" data-route="/admin/categories">Kelola Kategori</a>
            <a href="#/admin/settings" class="navbar-link ${isActive('/admin/settings')}" data-route="/admin/settings">Pengaturan</a>
          `
          : `<a href="#/login" class="navbar-link ${isActive('/login')}" data-route="/login">Login Admin</a>`
        }
      </div>
    </nav>
  `;
}

export function initNavbar() {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      mobileToggle.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
      });
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logoutAdmin();
      navigate('/');
    });
  }

  // Sticky navbar on scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}

export function updateNavbar() {
  const oldNavbar = document.getElementById('navbar');
  if (!oldNavbar) return;

  const newHTML = renderNavbar();
  oldNavbar.outerHTML = newHTML;
  initNavbar();
}
