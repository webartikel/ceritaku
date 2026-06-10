// ============================================
// CeritaKu — Firestore Database Service
// ============================================

import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter,
  serverTimestamp, increment, setDoc
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { db } from './firebase-config.js';
import { isFirebaseConfigured } from './firebase-config.js';
import { CATEGORIES } from '../utils/helpers.js';

// ============================================
// DEMO DATA (used when Firebase is not configured)
// ============================================

const DEMO_STORIES = [
  {
    id: 'demo-1',
    title: 'Perjalanan ke Puncak Rinjani: Menemukan Kedamaian di Atas Awan',
    slug: 'perjalanan-ke-puncak-rinjani',
    coverImage: '',
    excerpt: 'Mendaki Gunung Rinjani adalah pengalaman yang mengubah cara pandangku terhadap kehidupan. Di ketinggian 3.726 meter, aku menemukan arti sesungguhnya dari ketenangan.',
    content: `<h2>Awal Perjalanan</h2>
<p>Pagi itu, langit masih gelap ketika kami memulai perjalanan dari Senaru, sebuah desa kecil di kaki Gunung Rinjani. Udara sejuk menyambut kami dengan lembut, seolah memberikan semangat untuk pendakian yang akan kami hadapi.</p>
<p>Tim kami terdiri dari enam orang — masing-masing membawa cerita dan alasan berbeda mengapa mereka ingin menaklukkan puncak tertinggi di Lombok ini. Ada yang mencari petualangan, ada yang ingin membuktikan diri, dan ada juga yang sekadar ingin melarikan diri dari hiruk-pikuk kota.</p>
<blockquote>Gunung tidak pernah menolak siapapun yang datang dengan niat baik. Ia hanya menguji seberapa kuat tekadmu untuk mencapai puncak.</blockquote>
<h2>Melewati Hutan Tropis</h2>
<p>Jalur pertama membawa kami melewati hutan tropis yang rimbun. Suara burung berkicau menjadi soundtrack alami yang menemani langkah kami. Pohon-pohon tinggi menjulang, menciptakan kanopi alami yang melindungi kami dari teriknya matahari.</p>
<p>Setelah beberapa jam berjalan, kami mulai merasakan perubahan suhu yang signifikan. Udara semakin dingin dan jalur mulai menanjak lebih curam. Di sinilah mental dan fisik benar-benar diuji.</p>
<h2>Momen di Puncak</h2>
<p>Ketika akhirnya kami tiba di puncak, semua rasa lelah seolah menguap begitu saja. Pemandangan yang tersaji di depan mata sungguh memukau — lautan awan yang membentang sejauh mata memandang, dengan sinar matahari keemasan yang menerobos di antaranya.</p>
<p>Di momen itu, aku menyadari bahwa keindahan sejati sering kali tersembunyi di balik perjuangan. Bahwa setiap langkah berat yang kita ambil akan membawa kita ke tempat yang lebih tinggi, baik secara harfiah maupun kiasan.</p>`,
    category: 'Perjalanan',
    tags: ['pendakian', 'rinjani', 'lombok', 'alam'],
    createdAt: { seconds: Date.now() / 1000 - 86400 * 5, toDate: () => new Date(Date.now() - 86400000 * 5) },
    updatedAt: { seconds: Date.now() / 1000 - 86400 * 5, toDate: () => new Date(Date.now() - 86400000 * 5) },
    publishedAt: { seconds: Date.now() / 1000 - 86400 * 5, toDate: () => new Date(Date.now() - 86400000 * 5) },
    status: 'published',
    views: 342
  },
  {
    id: 'demo-2',
    title: 'Belajar dari Kegagalan: Bagaimana Startup Pertamaku Mengajarkan Segalanya',
    slug: 'belajar-dari-kegagalan-startup',
    coverImage: '',
    excerpt: 'Startup pertamaku gagal dalam 8 bulan. Tapi dari kegagalan itu, aku belajar lebih banyak daripada 4 tahun kuliah. Ini adalah ceritanya.',
    content: `<h2>Ide Brilian yang Naif</h2>
<p>Semuanya dimulai dari sebuah ide yang kupikir akan mengubah dunia — sebuah aplikasi yang menghubungkan petani lokal langsung dengan konsumen di kota. Idenya sederhana, eksekusinya? Jauh lebih rumit dari yang kubayangkan.</p>
<p>Dengan modal tabungan dan keberanian tanpa batas, aku dan dua temanku memulai perjalanan sebagai founder startup. Kami menyewa co-working space kecil, membeli whiteboard besar, dan mulai merancang masa depan yang kami yakini akan cemerlang.</p>
<h2>Realita yang Keras</h2>
<p>Bulan pertama penuh dengan euforia. Kami coding siang malam, meeting dengan potential users, dan membangun MVP dengan kecepatan yang luar biasa. Tapi masalah mulai muncul ketika kami meluncurkan produk ke pasar.</p>
<p>Ternyata, menghubungkan petani dengan teknologi tidaklah semudah yang kami pikirkan. Banyak petani yang tidak memiliki smartphone, koneksi internet di daerah pedesaan sangat terbatas, dan kebiasaan jual-beli yang sudah mengakar sulit untuk diubah dalam semalam.</p>
<blockquote>Kegagalan bukan akhir dari segalanya. Kegagalan adalah awal dari pemahaman yang lebih dalam tentang dunia nyata.</blockquote>
<h2>Pelajaran yang Tak Ternilai</h2>
<p>Ketika akhirnya kami memutuskan untuk menutup startup, aku merasa hancur. Tapi seiring waktu, aku menyadari bahwa 8 bulan itu mengajarkanku lebih banyak daripada yang bisa diberikan oleh universitas manapun.</p>
<p>Aku belajar tentang empati — bagaimana benar-benar memahami kebutuhan pengguna, bukan hanya membayangkannya. Aku belajar tentang kerendahan hati — bahwa ide brilian tanpa eksekusi yang tepat hanyalah mimpi. Dan yang terpenting, aku belajar bahwa kegagalan adalah guru terbaik.</p>`,
    category: 'Pengalaman',
    tags: ['startup', 'kegagalan', 'entrepreneurship', 'belajar'],
    createdAt: { seconds: Date.now() / 1000 - 86400 * 3, toDate: () => new Date(Date.now() - 86400000 * 3) },
    updatedAt: { seconds: Date.now() / 1000 - 86400 * 3, toDate: () => new Date(Date.now() - 86400000 * 3) },
    publishedAt: { seconds: Date.now() / 1000 - 86400 * 3, toDate: () => new Date(Date.now() - 86400000 * 3) },
    status: 'published',
    views: 567
  },
  {
    id: 'demo-3',
    title: 'Seni Hidup Minimalis: Melepaskan untuk Mendapatkan Lebih',
    slug: 'seni-hidup-minimalis',
    coverImage: '',
    excerpt: 'Ketika aku memutuskan untuk menyingkirkan 70% barang-barangku, hidupku justru terasa lebih kaya. Ini bukan tentang memiliki sedikit, tapi tentang memilih yang bermakna.',
    content: `<h2>Titik Balik</h2>
<p>Apartemen 30 meter persegi-ku dipenuhi dengan barang-barang yang sudah bertahun-tahun tidak kusentuh. Lemari penuh pakaian yang tidak pernah kupakai, rak buku berisi novel yang tidak pernah kubaca, dan laci-laci penuh dengan gadget yang sudah usang.</p>
<p>Titik baliknya datang ketika aku harus pindah ke kota lain untuk pekerjaan baru. Mengemas semua barang-barang itu terasa seperti mengangkat beban yang selama ini tidak kusadari keberadaannya.</p>
<h2>Proses Melepaskan</h2>
<p>Aku mulai dengan metode sederhana: jika sebuah barang tidak kugunakan dalam 6 bulan terakhir, maka aku tidak membutuhkannya. Hasilnya mengejutkan — hampir 70% barang-barangku masuk dalam kategori ini.</p>
<p>Proses melepaskan ternyata tidak semudah yang kubayangkan. Setiap barang membawa kenangan, dan melepaskannya terasa seperti melepaskan bagian dari diriku. Tapi perlahan, aku menyadari bahwa kenangan ada di dalam hati, bukan di dalam barang.</p>
<blockquote>Minimalis bukan tentang tidak memiliki apa-apa. Minimalis adalah tentang memberi ruang untuk hal-hal yang benar-benar penting.</blockquote>
<h2>Kehidupan Baru</h2>
<p>Setelah proses decluttering, apartemen baruku terasa jauh lebih luas dan tenang. Setiap barang yang tersisa memiliki tujuan dan makna. Aku bisa menemukan apa yang kucari dalam hitungan detik, bukan menit.</p>
<p>Yang paling mengejutkan, kebahagiaan dan kreativitasku meningkat drastis. Dengan lebih sedikit distraksi, pikiranku menjadi lebih jernih. Aku mulai menulis lebih banyak, membaca lebih fokus, dan menikmati momen-momen kecil yang sebelumnya terlewatkan.</p>`,
    category: 'Kehidupan',
    tags: ['minimalis', 'lifestyle', 'self-improvement', 'declutter'],
    createdAt: { seconds: Date.now() / 1000 - 86400 * 1, toDate: () => new Date(Date.now() - 86400000 * 1) },
    updatedAt: { seconds: Date.now() / 1000 - 86400 * 1, toDate: () => new Date(Date.now() - 86400000 * 1) },
    publishedAt: { seconds: Date.now() / 1000 - 86400 * 1, toDate: () => new Date(Date.now() - 86400000 * 1) },
    status: 'published',
    views: 891
  },
  {
    id: 'demo-4',
    title: 'Mengenal AI: Bagaimana Kecerdasan Buatan Mengubah Cara Kita Berkarya',
    slug: 'mengenal-ai-kecerdasan-buatan',
    coverImage: '',
    excerpt: 'Dari menulis artikel hingga menciptakan seni, AI telah mengubah landscape kreatif secara fundamental. Bagaimana kita beradaptasi?',
    content: `<h2>Era Baru Kreativitas</h2>
<p>Tahun 2025 menjadi titik di mana kecerdasan buatan tidak lagi menjadi konsep futuristik, melainkan realita sehari-hari. Sebagai seorang penulis dan content creator, aku menyaksikan sendiri bagaimana AI mengubah cara kita berkarya.</p>
<p>Awalnya, aku skeptis. Bagaimana mungkin mesin bisa memahami nuansa emosi manusia? Bagaimana bisa algoritma menciptakan sesuatu yang autentik dan bermakna? Tapi setelah berbulan-bulan bereksperimen, perspektifku berubah total.</p>
<h2>AI Sebagai Partner, Bukan Pengganti</h2>
<p>Kunci untuk memahami peran AI dalam kreativitas adalah melihatnya sebagai partner, bukan pengganti. AI bisa membantu kita brainstorm ide, mengolah data, dan bahkan memberikan perspektif yang tidak terpikirkan sebelumnya.</p>
<p>Misalnya, ketika menulis artikel ini, aku menggunakan AI untuk riset awal — mengumpulkan data, mencari referensi, dan mengidentifikasi tren. Tapi cerita, emosi, dan sudut pandang tetap datang dari pengalaman dan perasaanku sendiri.</p>
<blockquote>Teknologi terbaik adalah teknologi yang memberdayakan manusia, bukan menggantinya.</blockquote>
<h2>Masa Depan yang Harmonis</h2>
<p>Aku percaya masa depan kreativitas bukan tentang manusia vs AI, melainkan manusia dengan AI. Mereka yang mampu memanfaatkan kekuatan AI sambil tetap mempertahankan sentuhan kemanusiaan akan menjadi kreator yang paling relevan.</p>`,
    category: 'Teknologi',
    tags: ['AI', 'teknologi', 'kreativitas', 'masa depan'],
    createdAt: { seconds: Date.now() / 1000 - 86400 * 2, toDate: () => new Date(Date.now() - 86400000 * 2) },
    updatedAt: { seconds: Date.now() / 1000 - 86400 * 2, toDate: () => new Date(Date.now() - 86400000 * 2) },
    publishedAt: { seconds: Date.now() / 1000 - 86400 * 2, toDate: () => new Date(Date.now() - 86400000 * 2) },
    status: 'published',
    views: 1203
  },
  {
    id: 'demo-5',
    title: 'Mentari Pagi di Desa Nenek: Kenangan yang Tak Lekang oleh Waktu',
    slug: 'mentari-pagi-di-desa-nenek',
    coverImage: '',
    excerpt: 'Setiap liburan sekolah, aku selalu menghabiskan waktu di desa nenek. Di sana, aku belajar tentang kesederhanaan, ketulusan, dan arti sesungguhnya dari rumah.',
    content: `<h2>Aroma Kopi Pagi</h2>
<p>Jam lima pagi, suara ayam berkokok menjadi alarm alami yang membangunkanku dari tidur nyenyak. Dari dapur, aroma kopi tubruk yang diseduh nenek menguar ke seluruh penjuru rumah kayu sederhana yang sudah berusia puluhan tahun.</p>
<p>Aku bangkit dari tempat tidur — kasur kapuk yang terasa jauh lebih nyaman dari spring bed di apartemenku di Jakarta — dan berjalan ke dapur. Nenek sudah duduk di sana, dengan segelas kopi dan senyum hangat yang selalu membuatku merasa pulang.</p>
<h2>Pelajaran dari Kebun</h2>
<p>Setelah sarapan nasi goreng sederhana buatan nenek (yang entah mengapa selalu terasa lebih enak dari restoran manapun), kami berjalan ke kebun di belakang rumah. Nenek mengajariku menanam kangkung, memetik cabai, dan merawat pohon mangga yang sudah berbuah sejak sebelum aku lahir.</p>
<blockquote>Nenek selalu bilang, "Menanam itu seperti hidup. Kamu harus sabar, telaten, dan percaya bahwa hasil akan datang pada waktunya."</blockquote>
<h2>Waktu yang Berharga</h2>
<p>Sekarang, setelah nenek tiada, aku sering kembali ke desa itu. Rumah kayu masih berdiri, meski sudah banyak yang berubah. Pohon mangga masih berbuah setiap musim, seolah menjaga janji yang dulu nenek tanam.</p>
<p>Di tengah kesibukan kota, kenangan tentang mentari pagi di desa nenek menjadi oasis yang selalu kukunjungi dalam pikiranku. Mengingatkanku bahwa rumah bukan tentang tempat, tapi tentang orang-orang yang membuat hatimu merasa tenang.</p>`,
    category: 'Inspirasi',
    tags: ['keluarga', 'kenangan', 'desa', 'nenek'],
    createdAt: { seconds: Date.now() / 1000 - 86400 * 7, toDate: () => new Date(Date.now() - 86400000 * 7) },
    updatedAt: { seconds: Date.now() / 1000 - 86400 * 7, toDate: () => new Date(Date.now() - 86400000 * 7) },
    publishedAt: { seconds: Date.now() / 1000 - 86400 * 7, toDate: () => new Date(Date.now() - 86400000 * 7) },
    status: 'published',
    views: 456
  }
];

// Generate cover images using colors
function generateCoverSVG(index) {
  const gradients = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
  ];
  const [c1, c2] = gradients[index % gradients.length];
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='${encodeURIComponent(c1)}'/%3E%3Cstop offset='100%25' stop-color='${encodeURIComponent(c2)}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='500' fill='url(%23g)'/%3E%3Ccircle cx='650' cy='100' r='200' fill='rgba(255,255,255,0.1)'/%3E%3Ccircle cx='150' cy='400' r='150' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E`;
}

// Assign cover images to demo stories
DEMO_STORIES.forEach((story, i) => {
  story.coverImage = generateCoverSVG(i);
});

const DEMO_SETTINGS = {
  siteName: 'CeritaKu',
  logo: '',
  description: 'Platform sederhana untuk menulis dan membagikan perjalanan hidupmu.',
  socialLinks: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    github: 'https://github.com'
  }
};

// In-memory store for demo mode
let demoStories = [...DEMO_STORIES];
let demoSettings = { ...DEMO_SETTINGS };

// ============================================
// STORIES CRUD
// ============================================

/**
 * Get all published stories
 */
export async function getPublishedStories({ category = null, search = null, limitCount = 20 } = {}) {
  if (!isFirebaseConfigured() || !db) {
    let stories = demoStories.filter(s => s.status === 'published');
    if (category) {
      stories = stories.filter(s => s.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      stories = stories.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    stories.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    return stories.slice(0, limitCount);
  }

  try {
    let q;
    if (category) {
      q = query(
        collection(db, 'stories'),
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );
    } else {
      q = query(
        collection(db, 'stories'),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    let stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const searchLower = search.toLowerCase();
      stories = stories.filter(s =>
        s.title.toLowerCase().includes(searchLower) ||
        (s.excerpt && s.excerpt.toLowerCase().includes(searchLower)) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(searchLower)))
      );
    }

    return stories;
  } catch (error) {
    console.error('Error fetching published stories:', error);
    return [];
  }
}

/**
 * Get story by slug
 */
export async function getStoryBySlug(slug) {
  if (!isFirebaseConfigured() || !db) {
    return demoStories.find(s => s.slug === slug) || null;
  }

  try {
    const q = query(collection(db, 'stories'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc_ = snapshot.docs[0];
    return { id: doc_.id, ...doc_.data() };
  } catch (error) {
    console.error('Error fetching story by slug:', error);
    return null;
  }
}

/**
 * Get all stories (admin)
 */
export async function getAllStories() {
  if (!isFirebaseConfigured() || !db) {
    return [...demoStories].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  }

  try {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all stories:', error);
    return [];
  }
}

/**
 * Get story by ID
 */
export async function getStoryById(id) {
  if (!isFirebaseConfigured() || !db) {
    return demoStories.find(s => s.id === id) || null;
  }

  try {
    const docRef = doc(db, 'stories', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
}

/**
 * Create a new story
 */
export async function createStory(data) {
  if (!isFirebaseConfigured() || !db) {
    const newStory = {
      id: 'demo-' + Date.now(),
      ...data,
      createdAt: { seconds: Date.now() / 1000, toDate: () => new Date() },
      updatedAt: { seconds: Date.now() / 1000, toDate: () => new Date() },
      publishedAt: data.status === 'published' ? { seconds: Date.now() / 1000, toDate: () => new Date() } : null,
      views: 0
    };
    demoStories.unshift(newStory);
    return newStory.id;
  }

  try {
    const storyData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: data.status === 'published' ? serverTimestamp() : null,
      views: 0
    };
    const docRef = await addDoc(collection(db, 'stories'), storyData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating story:', error);
    throw error;
  }
}

/**
 * Update a story
 */
export async function updateStory(id, data) {
  if (!isFirebaseConfigured() || !db) {
    const index = demoStories.findIndex(s => s.id === id);
    if (index !== -1) {
      demoStories[index] = {
        ...demoStories[index],
        ...data,
        updatedAt: { seconds: Date.now() / 1000, toDate: () => new Date() }
      };
      if (data.status === 'published' && !demoStories[index].publishedAt) {
        demoStories[index].publishedAt = { seconds: Date.now() / 1000, toDate: () => new Date() };
      }
    }
    return;
  }

  try {
    const docRef = doc(db, 'stories', id);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    if (data.status === 'published') {
      const existing = await getDoc(docRef);
      if (existing.exists() && !existing.data().publishedAt) {
        updateData.publishedAt = serverTimestamp();
      }
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
  }
}

/**
 * Delete a story
 */
export async function deleteStory(id) {
  if (!isFirebaseConfigured() || !db) {
    demoStories = demoStories.filter(s => s.id !== id);
    return;
  }

  try {
    await deleteDoc(doc(db, 'stories', id));
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
}

/**
 * Increment view count
 */
export async function incrementViews(id) {
  if (!isFirebaseConfigured() || !db) {
    const story = demoStories.find(s => s.id === id);
    if (story) story.views = (story.views || 0) + 1;
    return;
  }

  try {
    const docRef = doc(db, 'stories', id);
    await updateDoc(docRef, { views: increment(1) });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

/**
 * Get related stories by category
 */
export async function getRelatedStories(category, currentSlug, count = 3) {
  if (!isFirebaseConfigured() || !db) {
    return demoStories
      .filter(s => s.category === category && s.slug !== currentSlug && s.status === 'published')
      .slice(0, count);
  }

  try {
    const q = query(
      collection(db, 'stories'),
      where('status', '==', 'published'),
      where('category', '==', category),
      orderBy('publishedAt', 'desc'),
      limit(count + 1)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(s => s.slug !== currentSlug)
      .slice(0, count);
  } catch (error) {
    console.error('Error fetching related stories:', error);
    return [];
  }
}

// ============================================
// SETTINGS
// ============================================

/**
 * Get site settings
 */
export async function getSettings() {
  if (!isFirebaseConfigured() || !db) {
    return demoSettings;
  }

  try {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Create default settings
      await setDoc(docRef, DEMO_SETTINGS);
      return DEMO_SETTINGS;
    }
    return docSnap.data();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return DEMO_SETTINGS;
  }
}

/**
 * Update site settings
 */
export async function updateSettings(data) {
  if (!isFirebaseConfigured() || !db) {
    demoSettings = { ...demoSettings, ...data };
    return;
  }

  try {
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

// ============================================
// STATS
// ============================================

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
  const stories = await getAllStories();
  const published = stories.filter(s => s.status === 'published');
  const drafts = stories.filter(s => s.status === 'draft');
  const totalViews = stories.reduce((sum, s) => sum + (s.views || 0), 0);

  return {
    totalStories: stories.length,
    publishedStories: published.length,
    draftStories: drafts.length,
    totalViews,
    recentStories: stories.slice(0, 5)
  };
}
