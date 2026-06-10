// ============================================
// CeritaKu — About Page
// ============================================

import { setTitle, setDescription } from '../utils/seo.js';
import { observeElements } from '../utils/animations.js';

export async function renderAbout(container) {
  setTitle('Tentang');
  setDescription('CeritaKu adalah platform sederhana untuk menulis dan membagikan perjalanan hidupmu.');

  container.innerHTML = `
    <div class="page-content">
      <section class="stories-header">
        <div class="container">
          <h1 class="page-title animate-fade-up">Tentang CeritaKu</h1>
          <p class="page-subtitle animate-fade-up" style="animation-delay:0.1s;margin:0 auto;">
            Platform yang lahir dari kecintaan terhadap seni bercerita
          </p>
        </div>
      </section>

      <section class="section-sm">
        <div class="about-content">
          <div class="reveal">
            <h2 style="font-family:var(--font-serif);font-size:var(--text-3xl);margin-bottom:var(--space-6);">
              Setiap orang punya cerita yang layak dibagikan
            </h2>
            <p>
              CeritaKu hadir sebagai ruang digital yang hangat dan personal, tempat di mana setiap orang 
              dapat menuangkan pengalaman, pemikiran, dan perjalanan hidupnya dalam bentuk tulisan yang indah.
            </p>
            <p>
              Kami percaya bahwa di balik setiap kehidupan terdapat cerita-cerita yang menakjubkan — 
              cerita tentang perjuangan, kebahagiaan, kegagalan yang menjadi pelajaran, dan momen-momen 
              kecil yang membentuk siapa kita hari ini.
            </p>
          </div>

          <div class="reveal" style="margin-top:var(--space-12);">
            <h3 style="font-size:var(--text-2xl);margin-bottom:var(--space-4);">Misi Kami</h3>
            <p>
              Menyediakan platform yang sederhana, elegan, dan mudah digunakan untuk siapa saja yang ingin 
              menulis dan membagikan ceritanya. Tanpa distraksi, tanpa kerumitan — hanya kamu dan kata-katamu.
            </p>
          </div>

          <div class="reveal" style="margin-top:var(--space-12);">
            <h3 style="font-size:var(--text-2xl);margin-bottom:var(--space-6);">Fitur Utama</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:var(--space-6);">
              <div class="card" style="border:none;box-shadow:none;background:var(--color-bg-alt);padding:var(--space-6);border-radius:var(--radius-xl);">
                <div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--color-primary-light);color:var(--color-primary);display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </div>
                <h4 style="margin-bottom:var(--space-2);">Editor Modern</h4>
                <p style="font-size:var(--text-sm);">Rich text editor yang intuitif untuk pengalaman menulis yang menyenangkan.</p>
              </div>
              <div class="card" style="border:none;box-shadow:none;background:var(--color-bg-alt);padding:var(--space-6);border-radius:var(--radius-xl);">
                <div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--color-success-light);color:var(--color-success);display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <h4 style="margin-bottom:var(--space-2);">Aman & Terpercaya</h4>
                <p style="font-size:var(--text-sm);">Ceritamu tersimpan aman dengan Firebase dan proteksi admin.</p>
              </div>
              <div class="card" style="border:none;box-shadow:none;background:var(--color-bg-alt);padding:var(--space-6);border-radius:var(--radius-xl);">
                <div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--color-accent-light);color:var(--color-accent);display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
                </div>
                <h4 style="margin-bottom:var(--space-2);">Desain Premium</h4>
                <p style="font-size:var(--text-sm);">Tampilan modern dan responsif yang membuat ceritamu tampil memukau.</p>
              </div>
            </div>
          </div>

          <div class="reveal" style="margin-top:var(--space-12);text-align:center;padding:var(--space-10);background:var(--color-bg-alt);border-radius:var(--radius-xl);">
            <p style="font-family:var(--font-serif);font-size:var(--text-2xl);font-style:italic;color:var(--color-text);margin-bottom:var(--space-4);">
              "Menulis adalah cara terindah untuk berbicara tanpa diganggu."
            </p>
            <p style="font-size:var(--text-sm);color:var(--color-text-tertiary);">— Jules Renard</p>
          </div>
        </div>
      </section>
    </div>
  `;

  observeElements();
}
