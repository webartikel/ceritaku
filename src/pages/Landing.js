// ============================================
// CeritaKu — Landing Page
// ============================================

import { getPublishedStories } from '../firebase/firestore.js';
import { renderStoryCard } from '../components/StoryCard.js';
import { renderStoryCardSkeleton } from '../components/Skeleton.js';
import { observeElements } from '../utils/animations.js';
import { resetSEO } from '../utils/seo.js';
import { formatNumber } from '../utils/helpers.js';

export async function renderLanding(container) {
  resetSEO();

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero" id="hero">
      <div class="hero-bg">
        <div class="hero-bg-grid"></div>
      </div>
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>

      <div class="hero-content">
        <div class="hero-badge animate-fade-down" style="animation-delay: 0.1s;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Platform Cerita Pribadi
        </div>

        <h1 class="hero-title animate-fade-up" style="animation-delay: 0.2s;">
          Tuliskan Ceritamu,<br/>
          <span class="highlight">Simpan Kenanganmu</span>
        </h1>

        <p class="hero-subtitle animate-fade-up" style="animation-delay: 0.35s;">
          Platform sederhana untuk menulis dan membagikan perjalanan hidupmu. 
          Setiap cerita berharga, setiap kenangan layak untuk dibagikan.
        </p>

        <div class="hero-actions animate-fade-up" style="animation-delay: 0.5s;">
          <a href="#/admin/editor" class="btn btn-primary btn-lg" data-route="/admin/editor">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            Mulai Menulis
          </a>
          <a href="#/stories" class="btn btn-secondary btn-lg" data-route="/stories">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            Baca Cerita
          </a>
        </div>


      </div>
    </section>

    <!-- Featured Stories -->
    <section class="featured-section" id="featured-section">
      <div class="container">
        <div class="section-header reveal">
          <div>
            <h2 class="section-title">Cerita Terbaru</h2>
            <p class="section-subtitle">Temukan inspirasi dari cerita-cerita pilihan kami</p>
          </div>
          <a href="#/stories" class="section-link" data-route="/stories">
            Lihat Semua
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <div class="stories-grid stagger-children" id="featured-stories">
          ${renderStoryCardSkeleton(3)}
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content reveal">
          <h2 class="cta-title">Siap Menulis Ceritamu?</h2>
          <p class="cta-text">
            Mulai perjalanan menulismu hari ini. Setiap cerita dimulai dari satu kata pertama.
          </p>
          <a href="#/admin/editor" class="btn btn-primary btn-lg" data-route="/admin/editor">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            Mulai Menulis Sekarang
          </a>
        </div>
      </div>
    </section>
  `;

  // Load featured stories
  try {
    const stories = await getPublishedStories({ limitCount: 3 });
    const featuredContainer = document.getElementById('featured-stories');
    if (featuredContainer) {
      featuredContainer.innerHTML = renderStoryCard ? stories.map((story, i) => renderStoryCard(story, { animate: true, index: i })).join('') : '';

      if (stories.length === 0) {
        featuredContainer.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1;">
            <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            <h3 class="empty-state-title">Belum Ada Cerita</h3>
            <p class="empty-state-text">Login sebagai admin dan mulai menulis cerita pertamamu!</p>
          </div>
        `;
      }



      // Trigger animations
      observeElements();
    }
  } catch (error) {
    console.error('Error loading featured stories:', error);
  }

  observeElements();
}
