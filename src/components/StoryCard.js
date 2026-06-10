// ============================================
// CeritaKu — StoryCard Component
// ============================================

import { formatDate, calculateReadTime, truncate, getDefaultCover } from '../utils/helpers.js';

export function renderStoryCard(story, options = {}) {
  const { animate = true, index = 0 } = options;
  const readTime = calculateReadTime(story.content);
  const excerpt = story.excerpt || truncate(story.content, 120);
  const coverImage = story.coverImage || getDefaultCover();
  const animClass = animate ? 'reveal' : '';

  return `
    <article class="card story-card ${animClass}" data-route="/stories/${story.slug}" style="${animate ? `transition-delay: ${index * 80}ms` : ''}">
      <div class="card-image-wrapper">
        <img 
          class="card-image" 
          src="${coverImage}" 
          alt="${story.title}"
          loading="lazy"
          onerror="this.src='${getDefaultCover()}'"
        />
        <span class="badge badge-primary card-category">${story.category || 'Umum'}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title line-clamp-2">${story.title}</h3>
        <p class="card-excerpt line-clamp-3">${excerpt}</p>
        <div class="card-meta">
          <span class="card-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            ${formatDate(story.publishedAt || story.createdAt)}
          </span>
          <span class="card-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${readTime} menit baca
          </span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render a list of story cards
 */
export function renderStoryCards(stories, options = {}) {
  if (!stories || stories.length === 0) {
    return `
      <div class="empty-state">
        <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
        <h3 class="empty-state-title">Belum Ada Cerita</h3>
        <p class="empty-state-text">Cerita yang kamu cari belum tersedia. Coba kata kunci atau kategori lain.</p>
      </div>
    `;
  }

  return stories.map((story, index) => renderStoryCard(story, { ...options, index })).join('');
}
