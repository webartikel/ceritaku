// ============================================
// CeritaKu — Dynamic SEO Manager
// ============================================

const DEFAULT_TITLE = 'CeritaKu — Tuliskan Ceritamu, Simpan Kenanganmu';
const DEFAULT_DESCRIPTION = 'Platform sederhana untuk menulis dan membagikan perjalanan hidupmu. Tulis, simpan, dan publikasikan cerita pribadimu.';
const DEFAULT_IMAGE = '';
const SITE_URL = window.location.origin + window.location.pathname;

/**
 * Update page title
 */
export function setTitle(title) {
  document.title = title ? `${title} — CeritaKu` : DEFAULT_TITLE;
}

/**
 * Update meta description
 */
export function setDescription(description) {
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', description || DEFAULT_DESCRIPTION);
}

/**
 * Update Open Graph tags
 */
export function setOpenGraph({ title, description, image, url, type = 'website' }) {
  const ogTags = {
    'og:title': title || DEFAULT_TITLE,
    'og:description': description || DEFAULT_DESCRIPTION,
    'og:image': image || DEFAULT_IMAGE,
    'og:url': url || window.location.href,
    'og:type': type,
    'og:site_name': 'CeritaKu'
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });

  // Twitter card tags
  const twitterTags = {
    'twitter:card': image ? 'summary_large_image' : 'summary',
    'twitter:title': title || DEFAULT_TITLE,
    'twitter:description': description || DEFAULT_DESCRIPTION,
    'twitter:image': image || DEFAULT_IMAGE,
  };

  Object.entries(twitterTags).forEach(([name, content]) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });
}

/**
 * Set canonical URL
 */
export function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url || window.location.href);
}

/**
 * Set structured data (JSON-LD)
 */
export function setStructuredData(data) {
  let script = document.getElementById('structured-data');
  if (!script) {
    script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Set all SEO tags for a story page
 */
export function setStorySEO(story) {
  if (!story) return;

  setTitle(story.title);
  setDescription(story.excerpt || '');
  setOpenGraph({
    title: story.title,
    description: story.excerpt || '',
    image: story.coverImage || '',
    url: `${SITE_URL}#/stories/${story.slug}`,
    type: 'article'
  });
  setCanonical(`${SITE_URL}#/stories/${story.slug}`);
  setStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.excerpt || '',
    image: story.coverImage || '',
    datePublished: story.publishedAt ? new Date(story.publishedAt.seconds * 1000).toISOString() : '',
    dateModified: story.updatedAt ? new Date(story.updatedAt.seconds * 1000).toISOString() : '',
    author: {
      '@type': 'Person',
      name: 'CeritaKu Author'
    },
    publisher: {
      '@type': 'Organization',
      name: 'CeritaKu'
    }
  });
}

/**
 * Reset SEO to defaults
 */
export function resetSEO() {
  setTitle('');
  setDescription('');
  setOpenGraph({});
  setCanonical('');
}
