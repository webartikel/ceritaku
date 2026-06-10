// ============================================
// CeritaKu — Story Editor Page
// ============================================

import { renderAdminSidebar } from './Dashboard.js';
import { createStory, updateStory, getStoryById } from '../firebase/firestore.js';
import { setTitle } from '../utils/seo.js';
import { slugify, CATEGORIES, debounce, getExcerpt } from '../utils/helpers.js';
import { toast } from '../components/Toast.js';
import { navigate } from '../utils/router.js';

let quillEditor = null;
let autosaveTimer = null;
let currentStoryId = null;
let isDirty = false;

export async function renderEditor(container, params = {}) {
  const editId = params.id || null;
  currentStoryId = editId;
  const isEditing = !!editId;

  setTitle(isEditing ? 'Edit Cerita' : 'Buat Cerita Baru');

  let storyData = {
    title: '',
    slug: '',
    coverImage: '',
    category: '',
    tags: [],
    content: '',
    status: 'draft'
  };

  if (isEditing) {
    const existing = await getStoryById(editId);
    if (existing) {
      storyData = { ...storyData, ...existing };
    }
  }

  container.innerHTML = `
    <div class="admin-layout">
      ${renderAdminSidebar('editor')}
      <main class="admin-main">
        <div class="editor-page">
          <!-- Top Bar -->
          <div class="editor-top-bar">
            <div>
              <h1 class="admin-title" style="margin-bottom:0;">${isEditing ? 'Edit Cerita' : 'Buat Cerita Baru'}</h1>
            </div>
            <div style="display:flex;align-items:center;gap:var(--space-3);">
              <span class="autosave-status" id="autosave-status">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                <span id="autosave-text"></span>
              </span>
              <button class="btn btn-ghost" id="btn-preview" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview
              </button>
              <button class="btn btn-secondary" id="btn-draft" type="button">Simpan Draft</button>
              <button class="btn btn-primary" id="btn-publish" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Publish
              </button>
            </div>
          </div>

          <!-- Title -->
          <textarea 
            class="editor-title-input" 
            id="editor-title" 
            placeholder="Tulis judul ceritamu..."
            rows="1"
          >${storyData.title}</textarea>

          <!-- Metadata Grid -->
          <div class="editor-meta-grid">
            <div class="form-group">
              <label class="form-label" for="editor-slug">Slug</label>
              <input type="text" class="form-input" id="editor-slug" placeholder="judul-cerita-url" value="${storyData.slug}" />
              <span class="form-hint">Otomatis dibuat dari judul. Bisa diedit manual.</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="editor-category">Kategori</label>
              <select class="form-input form-select" id="editor-category">
                <option value="">Pilih Kategori</option>
                ${CATEGORIES.map(cat => `<option value="${cat}" ${storyData.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Tags -->
          <div class="form-group" style="margin-bottom:var(--space-6);">
            <label class="form-label">Tags</label>
            <div class="tags-input-wrapper" id="tags-wrapper">
              ${storyData.tags.map(tag => `
                <span class="tag">
                  ${tag}
                  <span class="tag-remove" data-tag="${tag}">&times;</span>
                </span>
              `).join('')}
              <input type="text" class="tag-input" id="tag-input" placeholder="Tambah tag, tekan Enter..." />
            </div>
          </div>

          <!-- Cover Image -->
          <div class="form-group editor-cover-upload" style="margin-bottom:var(--space-6);">
            <label class="form-label">Cover Image</label>
            <div class="cover-upload-area ${storyData.coverImage ? 'has-image' : ''}" id="cover-area">
              ${storyData.coverImage ? `
                <img src="${storyData.coverImage}" class="cover-preview" id="cover-preview" alt="Cover" />
                <button class="btn btn-sm btn-danger cover-remove-btn" id="cover-remove" type="button">Hapus</button>
              ` : `
                <div class="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <p class="cover-upload-text"><strong>Klik untuk upload</strong> atau masukkan URL gambar</p>
                <p class="cover-upload-text" style="margin-top:var(--space-2);font-size:var(--text-xs);">PNG, JPG, WebP (maks 2MB)</p>
              `}
            </div>
            <input type="file" id="cover-file" accept="image/*" style="display:none;" />
            <div style="margin-top:var(--space-3);">
              <input type="text" class="form-input" id="cover-url" placeholder="Atau masukkan URL gambar..." value="${storyData.coverImage && !storyData.coverImage.startsWith('data:') ? storyData.coverImage : ''}" />
            </div>
          </div>

          <!-- Rich Text Editor -->
          <div class="form-group editor-wrapper" style="margin-bottom:var(--space-6);">
            <label class="form-label">Isi Cerita</label>
            <div id="editor-content"></div>
          </div>

          <!-- Preview Area (hidden by default) -->
          <div class="editor-preview story-content" id="preview-area" style="display:none;"></div>
        </div>
      </main>
    </div>
  `;

  // Initialize Quill
  initQuill(storyData.content);

  // Title auto-resize and slug generation
  const titleInput = document.getElementById('editor-title');
  const slugInput = document.getElementById('editor-slug');

  titleInput.addEventListener('input', () => {
    autoResizeTextarea(titleInput);
    if (!isEditing || slugInput.value === slugify(storyData.title)) {
      slugInput.value = slugify(titleInput.value);
    }
    isDirty = true;
  });
  autoResizeTextarea(titleInput);

  // Tags
  initTagsInput(storyData.tags);

  // Cover upload
  initCoverUpload();

  // Preview toggle
  const previewBtn = document.getElementById('btn-preview');
  const editorWrapper = document.querySelector('.editor-wrapper');
  const previewArea = document.getElementById('preview-area');
  let isPreview = false;

  previewBtn.addEventListener('click', () => {
    isPreview = !isPreview;
    if (isPreview) {
      previewArea.innerHTML = quillEditor.root.innerHTML;
      editorWrapper.style.display = 'none';
      previewArea.style.display = 'block';
      previewBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
        Editor
      `;
    } else {
      editorWrapper.style.display = 'block';
      previewArea.style.display = 'none';
      previewBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        Preview
      `;
    }
  });

  // Save Draft
  document.getElementById('btn-draft').addEventListener('click', () => saveStory('draft'));
  
  // Publish
  document.getElementById('btn-publish').addEventListener('click', () => saveStory('published'));

  // Autosave
  if (quillEditor) {
    quillEditor.on('text-change', () => {
      isDirty = true;
      startAutosave();
    });
  }
}

function initQuill(content) {
  if (typeof Quill === 'undefined') {
    console.warn('Quill not loaded. Using fallback textarea.');
    const container = document.getElementById('editor-content');
    container.innerHTML = `<textarea class="form-textarea" style="min-height:400px;font-size:var(--text-lg);" id="editor-fallback">${content}</textarea>`;
    return;
  }

  quillEditor = new Quill('#editor-content', {
    theme: 'snow',
    placeholder: 'Mulai menulis ceritamu di sini...',
    modules: {
      toolbar: [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ]
    }
  });

  if (content) {
    quillEditor.root.innerHTML = content;
  }
}

function getEditorContent() {
  if (quillEditor) {
    return quillEditor.root.innerHTML;
  }
  const fallback = document.getElementById('editor-fallback');
  return fallback ? fallback.value : '';
}

function initTagsInput(existingTags) {
  const wrapper = document.getElementById('tags-wrapper');
  const input = document.getElementById('tag-input');
  let tags = [...existingTags];

  wrapper.addEventListener('click', () => input.focus());

  // Remove tag
  wrapper.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.tag-remove');
    if (removeBtn) {
      const tagName = removeBtn.dataset.tag;
      tags = tags.filter(t => t !== tagName);
      removeBtn.parentElement.remove();
      isDirty = true;
    }
  });

  // Add tag
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = input.value.trim().toLowerCase().replace(/,/g, '');
      if (value && !tags.includes(value) && tags.length < 10) {
        tags.push(value);
        const tagEl = document.createElement('span');
        tagEl.className = 'tag';
        tagEl.innerHTML = `${value}<span class="tag-remove" data-tag="${value}">&times;</span>`;
        wrapper.insertBefore(tagEl, input);
        input.value = '';
        isDirty = true;
      }
    }
    if (e.key === 'Backspace' && !input.value && tags.length > 0) {
      const lastTag = tags.pop();
      wrapper.querySelector(`.tag-remove[data-tag="${lastTag}"]`)?.parentElement.remove();
      isDirty = true;
    }
  });

  // Store getter
  wrapper.getTags = () => tags;
}

function initCoverUpload() {
  const area = document.getElementById('cover-area');
  const fileInput = document.getElementById('cover-file');
  const urlInput = document.getElementById('cover-url');

  // Click to upload
  area.addEventListener('click', (e) => {
    if (e.target.closest('.cover-remove-btn')) return;
    fileInput.click();
  });

  // File selected
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Dimensi maksimal untuk cover image
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Kompres gambar menjadi JPEG dengan kualitas 70%
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

        // Cek jika ukuran string base64 masih terlalu besar
        if (compressedBase64.length > 900000) {
          toast.error('Ukuran gambar terlalu besar setelah kompresi. Silakan gunakan gambar dengan resolusi lebih rendah.');
          return;
        }

        setCoverImage(compressedBase64);
        urlInput.value = '';
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // URL input
  urlInput.addEventListener('change', (e) => {
    const url = e.target.value.trim();
    if (url) {
      setCoverImage(url);
    }
  });

  // Remove button
  area.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.cover-remove-btn');
    if (removeBtn) {
      e.stopPropagation();
      clearCoverImage();
      urlInput.value = '';
    }
  });
}

function setCoverImage(src) {
  const area = document.getElementById('cover-area');
  area.classList.add('has-image');
  area.innerHTML = `
    <img src="${src}" class="cover-preview" id="cover-preview" alt="Cover" />
    <button class="btn btn-sm btn-danger cover-remove-btn" id="cover-remove" type="button">Hapus</button>
  `;
  isDirty = true;
}

function clearCoverImage() {
  const area = document.getElementById('cover-area');
  area.classList.remove('has-image');
  area.innerHTML = `
    <div class="upload-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
    </div>
    <p class="cover-upload-text"><strong>Klik untuk upload</strong> atau masukkan URL gambar</p>
    <p class="cover-upload-text" style="margin-top:var(--space-2);font-size:var(--text-xs);">PNG, JPG, WebP (maks 2MB)</p>
  `;
  isDirty = true;
}

function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

function startAutosave() {
  clearTimeout(autosaveTimer);
  const statusEl = document.getElementById('autosave-status');
  const textEl = document.getElementById('autosave-text');
  
  if (statusEl && textEl) {
    statusEl.className = 'autosave-status';
    textEl.textContent = '';
  }

  autosaveTimer = setTimeout(async () => {
    if (!isDirty) return;
    
    if (statusEl && textEl) {
      statusEl.className = 'autosave-status saving';
      textEl.textContent = 'Menyimpan...';
    }

    try {
      await saveStory('draft', true);
      if (statusEl && textEl) {
        statusEl.className = 'autosave-status saved';
        textEl.textContent = 'Tersimpan';
      }
    } catch (err) {
      if (statusEl && textEl) {
        statusEl.className = 'autosave-status';
        textEl.textContent = 'Gagal menyimpan';
      }
    }
  }, 30000); // 30 seconds
}

async function saveStory(status, silent = false) {
  const title = document.getElementById('editor-title').value.trim();
  const slug = document.getElementById('editor-slug').value.trim();
  const category = document.getElementById('editor-category').value;
  const content = getEditorContent();
  const coverPreview = document.getElementById('cover-preview');
  const coverUrl = document.getElementById('cover-url').value.trim();
  const tagsWrapper = document.getElementById('tags-wrapper');
  const tags = tagsWrapper.getTags ? tagsWrapper.getTags() : [];

  if (!title) {
    if (!silent) toast.error('Judul cerita harus diisi');
    return;
  }

  const coverImage = coverPreview?.src || coverUrl || '';

  const storyData = {
    title,
    slug: slug || slugify(title),
    coverImage,
    excerpt: getExcerpt(content),
    content,
    category: category || 'Umum',
    tags,
    status
  };

  try {
    if (currentStoryId) {
      await updateStory(currentStoryId, storyData);
      if (!silent) {
        toast.success(status === 'published' ? 'Cerita berhasil dipublikasikan!' : 'Draft berhasil disimpan!');
      }
    } else {
      const newId = await createStory(storyData);
      currentStoryId = newId;
      if (!silent) {
        toast.success(status === 'published' ? 'Cerita berhasil dipublikasikan!' : 'Draft berhasil disimpan!');
        // Update URL to edit mode
        window.location.hash = `/admin/editor/${newId}`;
      }
    }
    isDirty = false;
  } catch (error) {
    console.error('Error saving story:', error);
    if (!silent) toast.error('Gagal menyimpan cerita: ' + error.message);
    throw error;
  }
}
