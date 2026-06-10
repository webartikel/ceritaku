// ============================================
// CeritaKu — Modal Component
// ============================================

let activeModal = null;

export function showModal({ title, message, confirmText = 'Konfirmasi', cancelText = 'Batal', type = 'default', onConfirm, onCancel }) {
  // Remove existing modal
  closeModal();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'modal-backdrop';

  const confirmClass = type === 'danger' ? 'btn-danger' : 'btn-primary';

  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" id="modal-close-btn" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="modal-cancel-btn">${cancelText}</button>
        <button class="btn ${confirmClass}" id="modal-confirm-btn">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.style.overflow = 'hidden';
  activeModal = backdrop;

  // Event listeners
  const closeBtn = backdrop.querySelector('#modal-close-btn');
  const cancelBtn = backdrop.querySelector('#modal-cancel-btn');
  const confirmBtn = backdrop.querySelector('#modal-confirm-btn');

  closeBtn.addEventListener('click', () => {
    closeModal();
    if (onCancel) onCancel();
  });

  cancelBtn.addEventListener('click', () => {
    closeModal();
    if (onCancel) onCancel();
  });

  confirmBtn.addEventListener('click', () => {
    closeModal();
    if (onConfirm) onConfirm();
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
      if (onCancel) onCancel();
    }
  });

  // ESC key
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (onCancel) onCancel();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

export function closeModal() {
  if (activeModal) {
    activeModal.classList.add('closing');
    setTimeout(() => {
      activeModal.remove();
      activeModal = null;
      document.body.style.overflow = '';
    }, 200);
  }
}
