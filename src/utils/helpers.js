// ============================================
// CeritaKu — Utility Helpers
// ============================================

/**
 * Generate a URL-friendly slug from a title
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Format a Firestore timestamp or Date to Indonesian locale
 */
export function formatDate(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a relative time (e.g., "2 jam lalu")
 */
export function formatRelativeTime(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return formatDate(date);
}

/**
 * Calculate estimated reading time in minutes
 */
export function calculateReadTime(content) {
  if (!content) return 1;
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200); // 200 words per minute
  return Math.max(1, readTime);
}

/**
 * Truncate text to a max length
 */
export function truncate(text, maxLength = 150) {
  if (!text) return '';
  const stripped = text.replace(/<[^>]*>/g, '');
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).trim() + '...';
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Debounce function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format number with separator (e.g., 1.234)
 */
export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('id-ID');
}

/**
 * Get excerpt from HTML content
 */
export function getExcerpt(htmlContent, maxLength = 160) {
  if (!htmlContent) return '';
  const text = htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return truncate(text, maxLength);
}

/**
 * Default cover image placeholder (SVG data URI)
 */
export function getDefaultCover() {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23e2e8f0'/%3E%3Ctext x='400' y='250' font-family='Inter,sans-serif' font-size='24' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'%3ECeritaKu%3C/text%3E%3C/svg%3E`;
}

/**
 * Categories list
 */
export const CATEGORIES = [
  'Perjalanan',
  'Kehidupan',
  'Teknologi',
  'Inspirasi',
  'Pengalaman',
  'Pendidikan',
  'Seni & Budaya',
  'Kesehatan'
];
