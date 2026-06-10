// ============================================
// CeritaKu — Main Application Entry Point
// ============================================

import { router, handleLinkClicks } from './utils/router.js';
import { initTheme } from './utils/theme.js';
import { initAnimations } from './utils/animations.js';
import { initFirebase, isFirebaseConfigured } from './firebase/firebase-config.js';
import { isAuthenticated, onAuthChange } from './firebase/auth.js';
import { renderNavbar, initNavbar, updateNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';

// Import pages
import { renderLanding } from './pages/Landing.js';
import { renderStories } from './pages/Stories.js';
import { renderStoryDetail } from './pages/StoryDetail.js';
import { renderAbout } from './pages/About.js';
import { renderLogin } from './pages/Login.js';
import { renderDashboard } from './pages/Dashboard.js';
import { renderEditor } from './pages/Editor.js';
import { renderManageStories } from './pages/ManageStories.js';
import { renderSettings } from './pages/Settings.js';
import { renderManageCategories } from './pages/ManageCategories.js';

// App state
let appContainer = null;

function isLoggedIn() {
  return isAuthenticated();
}

function getPageContainer() {
  return document.getElementById('page-content');
}

function renderLayout(contentHTML, options = { showNavbar: true, showFooter: true }) {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${options.showNavbar ? renderNavbar() : ''}
    <div class="page-content" id="page-content">
      ${contentHTML}
    </div>
    ${options.showFooter ? renderFooter() : ''}
  `;

  if (options.showNavbar) {
    initNavbar();
  }

  // Link click delegation
  handleLinkClicks(app);
}

// ============================================
// Route Handlers
// ============================================

async function handleLanding() {
  renderLayout('');
  const container = getPageContainer();
  await renderLanding(container);
  handleLinkClicks(container);
}

async function handleStories() {
  renderLayout('');
  const container = getPageContainer();
  await renderStories(container);
  handleLinkClicks(container);
}

async function handleStoryDetail(params) {
  renderLayout('');
  const container = getPageContainer();
  await renderStoryDetail(container, params);
  handleLinkClicks(container);
}

async function handleAbout() {
  renderLayout('');
  const container = getPageContainer();
  await renderAbout(container);
  handleLinkClicks(container);
}

async function handleLogin() {
  if (isLoggedIn()) {
    router.navigate('/admin');
    return;
  }
  renderLayout('', { showNavbar: false, showFooter: false });
  const container = getPageContainer();
  await renderLogin(container);
  handleLinkClicks(container);
}

async function handleDashboard() {
  renderLayout('', { showNavbar: true, showFooter: false });
  const container = getPageContainer();
  await renderDashboard(container);
  handleLinkClicks(container);
}

async function handleEditor(params) {
  renderLayout('', { showNavbar: true, showFooter: false });
  const container = getPageContainer();
  await renderEditor(container, params);
  handleLinkClicks(container);
}

async function handleManage() {
  renderLayout('', { showNavbar: true, showFooter: false });
  const container = getPageContainer();
  await renderManageStories(container);
  handleLinkClicks(container);
}

async function handleSettings() {
  renderLayout('', { showNavbar: true, showFooter: false });
  const container = getPageContainer();
  await renderSettings(container);
  handleLinkClicks(container);
}

async function handleManageCategories() {
  renderLayout('', { showNavbar: true, showFooter: false });
  const container = getPageContainer();
  await renderManageCategories(container);
  handleLinkClicks(container);
}

function handleNotFound() {
  renderLayout(`
    <div class="empty-state" style="min-height:60vh;">
      <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <h2 class="empty-state-title">404 — Halaman Tidak Ditemukan</h2>
      <p class="empty-state-text">Halaman yang kamu cari tidak ada.</p>
      <a href="#/" class="btn btn-primary" data-route="/">Kembali ke Beranda</a>
    </div>
  `);
}

// ============================================
// Initialize Application
// ============================================

function initApp() {
  console.log('🚀 CeritaKu — Initializing...');

  // Initialize theme
  initTheme();

  // Initialize Firebase
  initFirebase();

  // Initialize animations
  initAnimations();

  // Setup router
  router
    .addRoute('/', handleLanding)
    .addRoute('/stories', handleStories)
    .addRoute('/stories/:slug', handleStoryDetail)
    .addRoute('/about', handleAbout)
    .addRoute('/login', handleLogin)
    .addRoute('/admin', handleDashboard, { requiresAuth: true })
    .addRoute('/admin/editor', handleEditor, { requiresAuth: true })
    .addRoute('/admin/editor/:id', handleEditor, { requiresAuth: true })
    .addRoute('/admin/manage', handleManage, { requiresAuth: true })
    .addRoute('/admin/categories', handleManageCategories, { requiresAuth: true })
    .addRoute('/admin/settings', handleSettings, { requiresAuth: true })
    .setNotFound(handleNotFound);

  // Route guard for admin routes
  router.beforeEach(async (route, params) => {
    if (route.meta.requiresAuth && !isLoggedIn()) {
      router.navigate('/login');
      return false;
    }
    return true;
  });

  // Listen for auth state changes
  onAuthChange((user) => {
    // Re-render current route to update navbar
    updateNavbar();
    const currentPath = router.getHash();
    if (currentPath.startsWith('/admin') && !isAuthenticated()) {
      router.navigate('/login');
    }
  });

  // Start router
  router.start();

  console.log('✅ CeritaKu — Ready!');
  if (!isFirebaseConfigured()) {
    console.log('ℹ️ Mode Demo — Firebase belum dikonfigurasi. Data menggunakan demo data.');
  }
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
