// ============================================
// CeritaKu — Admin Dashboard Page
// ============================================

import { getDashboardStats } from '../firebase/firestore.js';
import { renderDashboardSkeleton } from '../components/Skeleton.js';
import { setTitle } from '../utils/seo.js';
import { formatNumber, formatDate, formatRelativeTime } from '../utils/helpers.js';
import { navigate } from '../utils/router.js';

export function renderAdminSidebar(activePage = 'dashboard') {
  return `
    <aside class="admin-sidebar" id="admin-sidebar">
      <nav class="sidebar-nav">
        <span class="sidebar-section">Menu</span>
        <a href="#/admin" class="sidebar-link ${activePage === 'dashboard' ? 'active' : ''}" data-route="/admin">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          Dashboard
        </a>
        <a href="#/admin/editor" class="sidebar-link ${activePage === 'editor' ? 'active' : ''}" data-route="/admin/editor">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          Buat Cerita
        </a>
        <a href="#/admin/manage" class="sidebar-link ${activePage === 'manage' ? 'active' : ''}" data-route="/admin/manage">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
          Kelola Cerita
        </a>
        <a href="#/admin/settings" class="sidebar-link ${activePage === 'settings' ? 'active' : ''}" data-route="/admin/settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Pengaturan
        </a>
      </nav>

      <div class="sidebar-footer">
        <a href="#/" class="sidebar-link" data-route="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Kembali ke Situs
        </a>
      </div>
    </aside>
  `;
}

export async function renderDashboard(container) {
  setTitle('Dashboard Admin');

  container.innerHTML = `
    <div class="admin-layout">
      ${renderAdminSidebar('dashboard')}
      <main class="admin-main">
        <div class="admin-header">
          <h1 class="admin-title">Dashboard</h1>
          <p class="admin-subtitle">Selamat datang di panel admin CeritaKu</p>
        </div>
        <div id="dashboard-content">
          ${renderDashboardSkeleton()}
        </div>
      </main>
    </div>
  `;

  // Load stats
  try {
    const stats = await getDashboardStats();
    const contentDiv = document.getElementById('dashboard-content');

    if (contentDiv) {
      contentDiv.innerHTML = `
        <!-- Stats Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-6);margin-bottom:var(--space-8);" class="animate-fade-up">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <div class="stat-value">${formatNumber(stats.totalStories)}</div>
            <div class="stat-label">Total Cerita</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div class="stat-value">${formatNumber(stats.totalViews)}</div>
            <div class="stat-label">Total Views</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div class="stat-value">${formatNumber(stats.draftStories)}</div>
            <div class="stat-label">Draft</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div style="display:flex;gap:var(--space-3);margin-bottom:var(--space-8);flex-wrap:wrap;" class="animate-fade-up" style="animation-delay:0.1s;">
          <a href="#/admin/editor" class="btn btn-primary" data-route="/admin/editor">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Buat Cerita Baru
          </a>
          <a href="#/admin/manage" class="btn btn-secondary" data-route="/admin/manage">
            Kelola Cerita
          </a>
        </div>

        <!-- Recent Stories Table -->
        <div class="animate-fade-up" style="animation-delay:0.2s;">
          <h3 style="font-size:var(--text-xl);margin-bottom:var(--space-5);">Cerita Terbaru</h3>
          ${stats.recentStories.length > 0 ? `
            <div class="table-wrapper">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Kategori</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${stats.recentStories.map(story => `
                      <tr style="cursor:pointer;" onclick="window.location.hash='/admin/editor/${story.id}'">
                        <td class="table-title">${story.title}</td>
                        <td><span class="badge badge-ghost">${story.category || 'Umum'}</span></td>
                        <td>
                          <span class="badge ${story.status === 'published' ? 'badge-success' : 'badge-warning'}">
                            ${story.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td>${formatNumber(story.views || 0)}</td>
                        <td>${formatRelativeTime(story.createdAt)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : `
            <div class="empty-state" style="padding:var(--space-10);">
              <p class="empty-state-text">Belum ada cerita. Mulai menulis sekarang!</p>
              <a href="#/admin/editor" class="btn btn-primary" data-route="/admin/editor">Buat Cerita</a>
            </div>
          `}
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}
