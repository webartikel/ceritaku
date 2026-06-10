// ============================================
// CeritaKu — Story Detail Page
// ============================================

import { getStoryBySlug, incrementViews, getRelatedStories } from '../firebase/firestore.js';
import { renderStoryCard } from '../components/StoryCard.js';
import { renderStoryDetailSkeleton } from '../components/Skeleton.js';
import { observeElements } from '../utils/animations.js';
import { setStorySEO } from '../utils/seo.js';
import { formatDate, calculateReadTime, getDefaultCover } from '../utils/helpers.js';

export async function renderStoryDetail(container, params) {
  const { slug } = params;

  // Show skeleton while loading
  container.innerHTML = renderStoryDetailSkeleton();

  try {
    const story = await getStoryBySlug(slug);

    if (!story) {
      container.innerHTML = `
        <div class="page-content">
          <div class="empty-state" style="min-height:60vh;">
            <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <h2 class="empty-state-title">Cerita Tidak Ditemukan</h2>
            <p class="empty-state-text">Cerita yang kamu cari tidak ada atau sudah dihapus.</p>
            <a href="#/stories" class="btn btn-primary" data-route="/stories">Kembali ke Daftar Cerita</a>
          </div>
        </div>
      `;
      return;
    }

    // Update SEO
    setStorySEO(story);

    // Increment views
    incrementViews(story.id);

    const readTime = calculateReadTime(story.content);
    const coverImage = story.coverImage || getDefaultCover();

    container.innerHTML = `
      <div class="page-content story-detail">
        <!-- Cover Image -->
        <div class="container container-lg" style="padding-top:var(--space-8);">
          <div class="story-cover-wrapper animate-fade-in">
            <img 
              class="story-cover" 
              src="${coverImage}" 
              alt="${story.title}"
              onerror="this.src='${getDefaultCover()}'"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="container container-content">
          <!-- Title & Meta -->
          <div class="animate-fade-up" style="animation-delay:0.15s;">
            <div style="display:flex;gap:var(--space-3);margin-bottom:var(--space-4);flex-wrap:wrap;">
              <span class="badge badge-primary">${story.category || 'Umum'}</span>
              ${(story.tags || []).map(tag => `<span class="badge badge-ghost">#${tag}</span>`).join('')}
            </div>

            <h1 class="story-detail-title">${story.title}</h1>

            <div class="story-detail-meta">
              <span class="story-detail-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                ${formatDate(story.publishedAt || story.createdAt)}
              </span>
              <span class="story-detail-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${readTime} menit baca
              </span>
              <span class="story-detail-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                ${story.views || 0} dilihat
              </span>
            </div>
          </div>

          <!-- Article Content -->
          <article class="story-content animate-fade-up" style="animation-delay:0.3s;">
            ${story.content}
          </article>

          <!-- Share Section -->
          <div class="share-section animate-fade-up" style="animation-delay:0.4s;">
            <span class="share-label">Bagikan cerita ini:</span>
            <div class="share-buttons">
              <button class="share-btn" id="share-twitter" title="Bagikan ke Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </button>
              <button class="share-btn" id="share-whatsapp" title="Bagikan ke WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </button>
              <button class="share-btn" id="share-copy" title="Salin Link">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Related Stories -->
        <div class="related-section container" id="related-stories-section" style="display:none;">
          <div class="section-header">
            <div>
              <h2 class="section-title">Cerita Terkait</h2>
              <p class="section-subtitle">Cerita lain yang mungkin kamu suka</p>
            </div>
          </div>
          <div class="stories-grid stagger-children" id="related-stories"></div>
        </div>
      </div>
    `;

    // Initialize share buttons
    initShareButtons(story);

    // Load related stories
    loadRelatedStories(story);

    observeElements();

  } catch (error) {
    console.error('Error loading story:', error);
    container.innerHTML = `
      <div class="page-content">
        <div class="empty-state" style="min-height:60vh;">
          <h2 class="empty-state-title">Gagal Memuat Cerita</h2>
          <p class="empty-state-text">Terjadi kesalahan. Silakan coba lagi.</p>
          <a href="#/stories" class="btn btn-primary" data-route="/stories">Kembali</a>
        </div>
      </div>
    `;
  }
}

function initShareButtons(story) {
  const url = window.location.href;
  const text = `${story.title} — CeritaKu`;

  document.getElementById('share-twitter')?.addEventListener('click', () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  });

  document.getElementById('share-whatsapp')?.addEventListener('click', () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  });

  document.getElementById('share-copy')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url);
      const btn = document.getElementById('share-copy');
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(() => {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
      }, 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
  });
}

async function loadRelatedStories(story) {
  try {
    const related = await getRelatedStories(story.category, story.slug, 3);
    const section = document.getElementById('related-stories-section');
    const grid = document.getElementById('related-stories');

    if (related.length > 0 && section && grid) {
      section.style.display = 'block';
      grid.innerHTML = related.map((s, i) => renderStoryCard(s, { animate: true, index: i })).join('');
      observeElements();
    }
  } catch (error) {
    console.error('Error loading related stories:', error);
  }
}
