// ============================================
// CeritaKu — Manage Categories Page
// ============================================

import { renderAdminSidebar } from './Dashboard.js';
import { getCategories, createCategory, deleteCategory } from '../firebase/firestore.js';
import { setTitle } from '../utils/seo.js';
import { toast } from '../components/Toast.js';
import { showModal } from '../components/Modal.js';

export async function renderManageCategories(container) {
  setTitle('Kelola Kategori');

  container.innerHTML = `
    <div class="admin-layout">
      ${renderAdminSidebar('categories')}
      <main class="admin-main">
        <div class="admin-header">
          <h1 class="admin-title">Kelola Kategori</h1>
          <p class="admin-subtitle">Tambah dan hapus kategori cerita untuk pengelompokan artikel</p>
        </div>

        <div class="categories-layout animate-fade-up">
          <!-- Kolom Kiri: Tambah Kategori -->
          <div class="settings-section">
            <h3 class="settings-section-title" style="margin-bottom:var(--space-4);padding-bottom:var(--space-2);">Tambah Kategori Baru</h3>
            <form id="add-category-form" style="display:flex;flex-direction:column;gap:var(--space-4);">
              <div class="form-group">
                <label class="form-label" for="category-name">Nama Kategori</label>
                <input 
                  type="text" 
                  class="form-input" 
                  id="category-name" 
                  placeholder="Contoh: Kuliner, Otomotif, Hobi..." 
                  required 
                  maxlength="30"
                  autocomplete="off"
                />
              </div>
              <button type="submit" class="btn btn-primary" id="btn-submit-category">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
                Tambah Kategori
              </button>
            </form>
          </div>

          <!-- Kolom Kanan: Daftar Kategori -->
          <div>
            <h3 style="font-size:var(--text-lg);font-weight:var(--font-semibold);color:var(--color-text);margin-bottom:var(--space-4);">Daftar Kategori</h3>
            <div id="categories-table-container">
              <div style="display:flex;justify-content:center;padding:var(--space-10);">
                <div class="spinner spinner-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  // Attach event listener to the add form
  const form = document.getElementById('add-category-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('category-name');
      const submitBtn = document.getElementById('btn-submit-category');
      const categoryName = input.value.trim();

      if (!categoryName) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> Menyimpan...';

      try {
        await createCategory(categoryName);
        toast.success(`Kategori "${categoryName}" berhasil ditambahkan!`);
        input.value = '';
        await loadCategoriesTable();
      } catch (error) {
        console.error('Error adding category:', error);
        toast.error(error.message || 'Gagal menambahkan kategori');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          Tambah Kategori
        `;
      }
    });
  }

  // Load the initial categories table
  await loadCategoriesTable();
}

async function loadCategoriesTable() {
  const container = document.getElementById('categories-table-container');
  if (!container) return;

  try {
    const categories = await getCategories();

    if (categories.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding:var(--space-10);background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-xl);">
          <p class="empty-state-text">Belum ada kategori yang tersimpan.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-wrapper animate-fade-up">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 80px;">No.</th>
                <th>Nama Kategori</th>
                <th style="width: 100px; text-align: center;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${categories.map((cat, idx) => `
                <tr>
                  <td style="font-size:var(--text-sm);color:var(--color-text-tertiary);">${idx + 1}</td>
                  <td>
                    <span style="font-weight:var(--font-medium);color:var(--color-text);">${cat.name}</span>
                  </td>
                  <td style="text-align: center;">
                    <button class="btn btn-danger btn-sm btn-delete-cat" data-id="${cat.id}" data-name="${cat.name}" title="Hapus Kategori">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Add event listeners for delete buttons
    const deleteButtons = container.querySelectorAll('.btn-delete-cat');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;

        showModal({
          title: 'Hapus Kategori',
          message: `Apakah kamu yakin ingin menghapus kategori "<strong>${name}</strong>"?<br/><small style="color:var(--color-text-tertiary);margin-top:var(--space-2);display:block;">Cerita yang menggunakan kategori ini tidak akan dihapus, tetapi filter kategori ini tidak akan tersedia lagi.</small>`,
          confirmText: 'Hapus',
          cancelText: 'Batal',
          type: 'danger',
          onConfirm: async () => {
            try {
              await deleteCategory(id);
              toast.success(`Kategori "${name}" berhasil dihapus`);
              await loadCategoriesTable();
            } catch (error) {
              console.error('Error deleting category:', error);
              toast.error('Gagal menghapus kategori');
            }
          }
        });
      });
    });

  } catch (error) {
    console.error('Error loading categories:', error);
    container.innerHTML = `
      <div class="empty-state" style="padding:var(--space-10);background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-xl);">
        <p class="empty-state-text" style="color:var(--color-danger);">Terjadi kesalahan saat memuat daftar kategori.</p>
      </div>
    `;
  }
}
