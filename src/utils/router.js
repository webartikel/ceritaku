// ============================================
// CeritaKu — Hash-Based SPA Router
// ============================================

export class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.beforeEachGuard = null;
    this.onNotFound = null;
    this._handleHashChange = this._handleHashChange.bind(this);
  }

  addRoute(path, handler, meta = {}) {
    // Convert path pattern to regex
    // Supports :param patterns like /stories/:slug
    const paramNames = [];
    const regexStr = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${regexStr}$`);

    this.routes.push({ path, regex, paramNames, handler, meta });
    return this;
  }

  beforeEach(guard) {
    this.beforeEachGuard = guard;
    return this;
  }

  setNotFound(handler) {
    this.onNotFound = handler;
    return this;
  }

  start() {
    window.addEventListener('hashchange', this._handleHashChange);
    // Initial route
    this._handleHashChange();
  }

  stop() {
    window.removeEventListener('hashchange', this._handleHashChange);
  }

  navigate(path) {
    window.location.hash = path;
  }

  getHash() {
    const hash = window.location.hash.slice(1) || '/';
    return hash;
  }

  async _handleHashChange() {
    const path = this.getHash();
    let matched = false;

    for (const route of this.routes) {
      const match = path.match(route.regex);
      if (match) {
        // Extract params
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(match[i + 1]);
        });

        // Before each guard
        if (this.beforeEachGuard) {
          const allowed = await this.beforeEachGuard(route, params);
          if (!allowed) return;
        }

        // Page transition
        const appContent = document.getElementById('page-content');
        if (appContent) {
          appContent.classList.add('page-transition-exit');
          await new Promise(r => setTimeout(r, 150));
        }

        this.currentRoute = { ...route, params };

        // Execute handler
        await route.handler(params);

        // Animate in
        if (appContent) {
          appContent.classList.remove('page-transition-exit');
          appContent.classList.add('page-transition-enter');
          requestAnimationFrame(() => {
            appContent.classList.add('page-transition-active');
            appContent.classList.remove('page-transition-enter');
          });
          setTimeout(() => {
            appContent.classList.remove('page-transition-active');
          }, 350);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        matched = true;
        break;
      }
    }

    if (!matched && this.onNotFound) {
      this.onNotFound(path);
    }
  }
}

// Global router instance
export const router = new Router();

// Navigation helper
export function navigate(path) {
  router.navigate(path);
}

// Link click handler - use in event delegation
export function handleLinkClicks(container) {
  container.addEventListener('click', (e) => {
    const link = e.target.closest('[data-route]');
    if (link) {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      navigate(route);
    }
  });
}
