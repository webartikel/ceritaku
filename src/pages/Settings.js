// ============================================
// CeritaKu — Settings Page
// ============================================

import { renderAdminSidebar } from './Dashboard.js';
import { getSettings, updateSettings } from '../firebase/firestore.js';
import { setTitle } from '../utils/seo.js';
import { toast } from '../components/Toast.js';

export async function renderSettings(container) {
  setTitle('Pengaturan');

  container.innerHTML = `
    <div class="admin-layout">
      ${renderAdminSidebar('settings')}
      <main class="admin-main">
        <div class="admin-header">
          <h1 class="admin-title">Pengaturan</h1>
          <p class="admin-subtitle">Konfigurasi situs CeritaKu</p>
        </div>

        <div id="settings-content" style="display:flex;justify-content:center;padding:var(--space-10);">
          <div class="spinner spinner-lg"></div>
        </div>
      </main>
    </div>
  `;

  // Load settings
  try {
    const settings = await getSettings();
    const contentDiv = document.getElementById('settings-content');

    if (contentDiv) {
      contentDiv.innerHTML = `
        <div class="settings-form animate-fade-up">
          <div class="settings-section">
            <h3 class="settings-section-title">Informasi Situs</h3>
            <div style="display:flex;flex-direction:column;gap:var(--space-5);">
              <div class="form-group">
                <label class="form-label" for="site-name">Nama Situs</label>
                <input type="text" class="form-input" id="site-name" value="${settings.siteName || 'CeritaKu'}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="site-description">Deskripsi</label>
                <textarea class="form-input form-textarea" id="site-description" rows="3">${settings.description || ''}</textarea>
              </div>
              <div class="form-group">
                <label class="form-label" for="site-logo">Logo URL</label>
                <input type="text" class="form-input" id="site-logo" value="${settings.logo || ''}" placeholder="https://example.com/logo.png" />
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3 class="settings-section-title">Media Sosial</h3>
            <div style="display:flex;flex-direction:column;gap:var(--space-5);">
              <div class="form-group">
                <label class="form-label" for="social-twitter">Twitter URL</label>
                <input type="text" class="form-input" id="social-twitter" value="${settings.socialLinks?.twitter || ''}" placeholder="https://twitter.com/username" />
              </div>
              <div class="form-group">
                <label class="form-label" for="social-instagram">Instagram URL</label>
                <input type="text" class="form-input" id="social-instagram" value="${settings.socialLinks?.instagram || ''}" placeholder="https://instagram.com/username" />
              </div>
              <div class="form-group">
                <label class="form-label" for="social-github">GitHub URL</label>
                <input type="text" class="form-input" id="social-github" value="${settings.socialLinks?.github || ''}" placeholder="https://github.com/username" />
              </div>
            </div>
          </div>

          <button class="btn btn-primary btn-lg" id="save-settings" style="align-self:flex-start;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Simpan Pengaturan
          </button>
        </div>
      `;

      // Save handler
      document.getElementById('save-settings').addEventListener('click', async () => {
        const btn = document.getElementById('save-settings');
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner"></div> Menyimpan...';

        try {
          await updateSettings({
            siteName: document.getElementById('site-name').value.trim(),
            description: document.getElementById('site-description').value.trim(),
            logo: document.getElementById('site-logo').value.trim(),
            socialLinks: {
              twitter: document.getElementById('social-twitter').value.trim(),
              instagram: document.getElementById('social-instagram').value.trim(),
              github: document.getElementById('social-github').value.trim()
            }
          });

          toast.success('Pengaturan berhasil disimpan!');
        } catch (error) {
          toast.error('Gagal menyimpan pengaturan');
        } finally {
          btn.disabled = false;
          btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Simpan Pengaturan
          `;
        }
      });
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}
