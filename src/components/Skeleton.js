// ============================================
// CeritaKu — Skeleton Loading Components
// ============================================

export function renderStoryCardSkeleton(count = 6) {
  let skeletons = '';
  for (let i = 0; i < count; i++) {
    skeletons += `
      <div class="card skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="card-body">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div style="display:flex; gap:var(--space-4); margin-top:var(--space-4);">
            <div class="skeleton skeleton-text shorter" style="margin:0;width:80px;height:12px;"></div>
            <div class="skeleton skeleton-text shorter" style="margin:0;width:80px;height:12px;"></div>
          </div>
        </div>
      </div>
    `;
  }
  return skeletons;
}

export function renderStoryDetailSkeleton() {
  return `
    <div class="container container-lg" style="padding-top:var(--space-8);">
      <div class="skeleton skeleton-image" style="border-radius:var(--radius-2xl);margin-bottom:var(--space-10);max-height:400px;height:300px;"></div>
      <div style="max-width:var(--content-width);margin:0 auto;">
        <div class="skeleton skeleton-title" style="height:40px;width:90%;margin-bottom:var(--space-4);"></div>
        <div class="skeleton skeleton-title" style="height:40px;width:60%;margin-bottom:var(--space-8);"></div>
        <div style="display:flex;gap:var(--space-6);margin-bottom:var(--space-10);">
          <div class="skeleton" style="width:120px;height:16px;border-radius:var(--radius-sm);"></div>
          <div class="skeleton" style="width:100px;height:16px;border-radius:var(--radius-sm);"></div>
          <div class="skeleton" style="width:80px;height:16px;border-radius:var(--radius-sm);"></div>
        </div>
        <div class="skeleton skeleton-text" style="height:16px;margin-bottom:var(--space-4);"></div>
        <div class="skeleton skeleton-text" style="height:16px;margin-bottom:var(--space-4);"></div>
        <div class="skeleton skeleton-text short" style="height:16px;margin-bottom:var(--space-6);"></div>
        <div class="skeleton skeleton-text" style="height:16px;margin-bottom:var(--space-4);"></div>
        <div class="skeleton skeleton-text" style="height:16px;margin-bottom:var(--space-4);"></div>
        <div class="skeleton skeleton-text shorter" style="height:16px;"></div>
      </div>
    </div>
  `;
}

export function renderDashboardSkeleton() {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-6);margin-bottom:var(--space-8);">
      ${Array(3).fill('').map(() => `
        <div class="stat-card">
          <div class="skeleton" style="width:48px;height:48px;border-radius:var(--radius-md);margin-bottom:var(--space-3);"></div>
          <div class="skeleton" style="width:60px;height:32px;border-radius:var(--radius-sm);margin-bottom:var(--space-2);"></div>
          <div class="skeleton" style="width:100px;height:14px;border-radius:var(--radius-sm);"></div>
        </div>
      `).join('')}
    </div>
    <div class="table-wrapper">
      <div style="padding:var(--space-5);">
        <div class="skeleton" style="width:200px;height:20px;border-radius:var(--radius-sm);margin-bottom:var(--space-6);"></div>
        ${Array(4).fill('').map(() => `
          <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-5);align-items:center;">
            <div class="skeleton" style="width:40%;height:16px;border-radius:var(--radius-sm);"></div>
            <div class="skeleton" style="width:15%;height:16px;border-radius:var(--radius-sm);"></div>
            <div class="skeleton" style="width:15%;height:16px;border-radius:var(--radius-sm);"></div>
            <div class="skeleton" style="width:10%;height:16px;border-radius:var(--radius-sm);"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
