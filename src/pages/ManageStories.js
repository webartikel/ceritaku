// ============================================
// CeritaKu — Manage Stories Page
// ============================================

import { renderAdminSidebar } from './Dashboard.js';
import { getAllStories, deleteStory } from '../firebase/firestore.js';
import { setTitle } from '../utils/seo.js';
import { formatDate, formatNumber, truncate } from '../utils/helpers.js';
import { showModal } from '../components/Modal.js';
import { toast } from '../components/Toast.js';
import { navigate } from '../utils/router.js';

export async function renderManageStories(container) {
  setTitle('Kelola Cerita');

  container.innerHTML = `
    <div class="admin-layout">
      ${renderAdminSidebar('manage')}
      <main class="admin-main">
        <div class="admin-header">
          <div class="manage-header">
            <div>
              <h1 class="admin-title">Kelola Cerita</h1>
              <p class="admin-subtitle">Kelola semua cerita yang sudah kamu tulis</p>
            </div>
            <a href="#/admin/editor" class="btn btn-primary" data-route="/admin/editor">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Cerita Baru
            </a>
          </div>
        </div>

        <div id="stories-table-container">
          <div style="display:flex;justify-content:center;padding:var(--space-16);">
            <div class="spinner spinner-lg"></div>
          </div>
        </div>
      </main>
    </div>
  `;

  await loadStoriesTable();
}

async function loadStoriesTable() {
  const tableContainer = document.getElementById('stories-table-container');
  if (!tableContainer) return;

  try {
    const stories = await getAllStories();

    if (stories.length === 0) {
      tableContainer.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          <h3 class="empty-state-title">Belum Ada Cerita</h3>
          <p class="empty-state-text">Mulai menulis cerita pertamamu!</p>
          <a href="#/admin/editor" class="btn btn-primary" data-route="/admin/editor">Buat Cerita</a>
        </div>
      `;
      return;
    }

    tableContainer.innerHTML = `
      <div class="table-wrapper animate-fade-up">
        <div class="table-responsive">
          <table class="table" id="manage-table">
            <thead>
              <tr>
                <th style="width:40%;">Judul</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Views</th>
                <th>Tanggal</th>
                <th style="width:120px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${stories.map(story => `
                <tr data-id="${story.id}">
                  <td>
                    <div class="table-title" style="margin-bottom:2px;">${truncate(story.title, 50)}</div>
                    <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);">/${story.slug}</div>
                  </td>
                  <td><span class="badge badge-ghost">${story.category || 'Umum'}</span></td>
                  <td>
                    <span class="badge ${story.status === 'published' ? 'badge-success' : 'badge-warning'}">
                      ${story.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>${formatNumber(story.views || 0)}</td>
                  <td style="font-size:var(--text-xs);color:var(--color-text-tertiary);">${formatDate(story.createdAt)}</td>
                  <td>
                    <div style="display:flex;gap:var(--space-2);">
                      <button class="btn btn-secondary btn-sm btn-edit" data-id="${story.id}" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      ${story.status === 'published' ? `
                        <button class="btn btn-secondary btn-sm btn-view" data-slug="${story.slug}" title="Lihat">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      ` : ''}
                      <button class="btn btn-danger btn-sm btn-delete" data-id="${story.id}" data-title="${story.title}" title="Hapus">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Event listeners
    tableContainer.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit');
      const viewBtn = e.target.closest('.btn-view');
      const deleteBtn = e.target.closest('.btn-delete');

      if (editBtn) {
        navigate(`/admin/editor/${editBtn.dataset.id}`);
      }

      if (viewBtn) {
        navigate(`/stories/${viewBtn.dataset.slug}`);
      }

      if (deleteBtn) {
        const storyId = deleteBtn.dataset.id;
        const storyTitle = deleteBtn.dataset.title;

        showModal({
          title: 'Hapus Cerita',
          message: `Apakah kamu yakin ingin menghapus cerita "<strong>${storyTitle}</strong>"? Tindakan ini tidak dapat dibatalkan.`,
          confirmText: 'Hapus',
          cancelText: 'Batal',
          type: 'danger',
          onConfirm: async () => {
            try {
              await deleteStory(storyId);
              toast.success('Cerita berhasil dihapus');
              await loadStoriesTable();
            } catch (error) {
              toast.error('Gagal menghapus cerita');
            }
          }
        });
      }
    });

  } catch (error) {
    console.error('Error loading stories:', error);
    tableContainer.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state-title">Gagal Memuat</h3>
        <p class="empty-state-text">Terjadi kesalahan saat memuat data cerita.</p>
      </div>
    `;
  }
}
