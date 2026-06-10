// ============================================
// CeritaKu — Stories List Page
// ============================================

import { getPublishedStories } from '../firebase/firestore.js';
import { renderStoryCards } from '../components/StoryCard.js';
import { renderStoryCardSkeleton } from '../components/Skeleton.js';
import { observeElements } from '../utils/animations.js';
import { setTitle, setDescription } from '../utils/seo.js';
import { debounce, CATEGORIES } from '../utils/helpers.js';

let currentCategory = null;
let currentSearch = '';

export async function renderStories(container) {
  setTitle('Semua Cerita');
  setDescription('Jelajahi cerita-cerita inspiratif dari para penulis CeritaKu.');

  // Parse URL params
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  currentCategory = params.get('category') || null;
  currentSearch = params.get('q') || '';

  container.innerHTML = `
    <div class="page-content">
      <!-- Header -->
      <section class="stories-header">
        <div class="container">
          <h1 class="page-title animate-fade-up">Jelajahi Cerita</h1>
          <p class="page-subtitle animate-fade-up" style="animation-delay:0.1s;margin:0 auto;">
            Temukan cerita-cerita yang menginspirasi, menghibur, dan memberikan perspektif baru.
          </p>
        </div>
      </section>

      <!-- Filters -->
      <section class="section-sm">
        <div class="container">
          <div class="stories-filters reveal">
            <div class="search-wrapper">
              <div class="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input 
                type="text" 
                class="search-input" 
                id="story-search" 
                placeholder="Cari cerita..." 
                value="${currentSearch}"
                autocomplete="off"
              />
            </div>
          </div>

          <div class="category-filters reveal" id="category-filters" style="margin-bottom:var(--space-8);">
            <button class="tag ${!currentCategory ? 'active' : ''}" data-category="">Semua</button>
            ${CATEGORIES.map(cat => `
              <button class="tag ${currentCategory === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>
            `).join('')}
          </div>

          <!-- Stories Grid -->
          <div class="stories-grid stagger-children" id="stories-grid">
            ${renderStoryCardSkeleton(6)}
          </div>
        </div>
      </section>
    </div>
  `;

  // Initialize search
  const searchInput = document.getElementById('story-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(async (e) => {
      currentSearch = e.target.value;
      await loadStories();
    }, 400));
  }

  // Initialize category filters
  const categoryFilters = document.getElementById('category-filters');
  if (categoryFilters) {
    categoryFilters.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-category]');
      if (!btn) return;

      currentCategory = btn.dataset.category || null;

      // Update active state
      categoryFilters.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      await loadStories();
    });
  }

  // Load initial stories
  await loadStories();
}

async function loadStories() {
  const grid = document.getElementById('stories-grid');
  if (!grid) return;

  // Show skeleton
  grid.innerHTML = renderStoryCardSkeleton(6);

  try {
    const stories = await getPublishedStories({
      category: currentCategory,
      search: currentSearch,
      limitCount: 20
    });

    grid.innerHTML = renderStoryCards(stories, { animate: true });
    observeElements();
  } catch (error) {
    console.error('Error loading stories:', error);
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <h3 class="empty-state-title">Gagal Memuat</h3>
        <p class="empty-state-text">Terjadi kesalahan saat memuat cerita. Silakan coba lagi.</p>
        <button class="btn btn-primary" onclick="location.reload()">Coba Lagi</button>
      </div>
    `;
  }
}
