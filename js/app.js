/* ===================== ESTADO ===================== */
const THEMES = [
  { id: "romance", name: "Romance", colors: ["#e0748f", "#fde9ef", "#d9a441"] },
  { id: "lavanda", name: "Lavanda", colors: ["#9b7ed1", "#ede4fb", "#c99ee0"] },
  { id: "por-do-sol", name: "Pôr do sol", colors: ["#f28f4c", "#ffe0c2", "#e8546a"] },
  { id: "jardim", name: "Jardim", colors: ["#7ba05b", "#e9f2df", "#cf9b45"] },
  { id: "noite", name: "Noite estrelada", colors: ["#c9a4ff", "#201f3d", "#f0c766"] },
  { id: "vintage", name: "Vintage", colors: ["#a9713f", "#ecdfc0", "#7c8a5a"] }
];

let memories = [];
let currentSort = "desc";
let currentCollectionFilter = "";
let currentLayout = "grid";
let selectedFrame = "frame-polaroid";
let activeCollectionName = null;
const flipbookState = { timeline: { items: [], index: 0 }, collection: { items: [], index: 0 } };

/* ===================== STORAGE ===================== */
function loadCustomMemories() {
  try {
    return JSON.parse(localStorage.getItem("album_custom_memories") || "[]");
  } catch (e) {
    return [];
  }
}
function saveCustomMemories(list) {
  localStorage.setItem("album_custom_memories", JSON.stringify(list));
}
function getAllMemories() {
  return [...DEFAULT_MEMORIES, ...loadCustomMemories()];
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  memories = getAllMemories();
  spawnPetals();
  renderHero();
  initTheme();
  initTabs();
  initToolbar();
  initLayoutToggle();
  initViewToggles();
  initModals();
  initAddForm();
  renderCollectionFilterOptions();
  renderAll();
});

/* ===================== HERO ===================== */
function renderHero() {
  const wrap = document.getElementById("hero-polaroids");
  if (!wrap) return;
  const photos = memories.filter(m => m.type === "image").slice(0, 3);
  wrap.innerHTML = photos.map(m => `<div class="hero-polaroid"><img src="${m.media}" alt="${escapeHtml(m.title)}"></div>`).join("");
}

/* ===================== PÉTALAS DECORATIVAS ===================== */
function spawnPetals() {
  const container = document.getElementById("petals");
  const emojis = ["🌸", "💮", "🌷", "✨"];
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = emojis[i % emojis.length];
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 10 + Math.random() * 14 + "s";
    p.style.animationDelay = Math.random() * 12 + "s";
    p.style.fontSize = 14 + Math.random() * 12 + "px";
    container.appendChild(p);
  }
}

/* ===================== TEMA ===================== */
function initTheme() {
  const saved = localStorage.getItem("album_theme") || "romance";
  document.body.dataset.theme = saved;

  const grid = document.getElementById("theme-grid");
  grid.innerHTML = "";
  THEMES.forEach(t => {
    const card = document.createElement("div");
    card.className = "theme-card" + (t.id === saved ? " active" : "");
    card.innerHTML = `<div class="theme-swatch" style="background: linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]}, ${t.colors[2]})"></div>${t.name}`;
    card.addEventListener("click", () => {
      document.body.dataset.theme = t.id;
      localStorage.setItem("album_theme", t.id);
      grid.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    });
    grid.appendChild(card);
  });

  document.getElementById("btn-theme").addEventListener("click", () => openModal("modal-theme"));
}

/* ===================== TABS ===================== */
function initTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    });
  });
}

/* ===================== TOOLBAR (busca/filtro/ordenar) ===================== */
function initToolbar() {
  document.getElementById("search-input").addEventListener("input", renderGridAll);
  document.getElementById("filter-collection").addEventListener("change", (e) => {
    currentCollectionFilter = e.target.value;
    renderGridAll();
  });
  const sortBtn = document.getElementById("btn-sort");
  sortBtn.addEventListener("click", () => {
    currentSort = currentSort === "desc" ? "asc" : "desc";
    sortBtn.textContent = currentSort === "desc" ? "Mais recentes primeiro ↓" : "Mais antigas primeiro ↑";
    renderGridAll();
  });
}

function renderCollectionFilterOptions() {
  const collections = [...new Set(memories.map(m => m.collection))];
  const select = document.getElementById("filter-collection");
  const inputSelect = document.getElementById("input-collection-select");
  select.innerHTML = `<option value="">Todas as coleções</option>`;
  inputSelect.innerHTML = `<option value="__new__">+ Criar nova coleção</option>`;
  collections.forEach(c => {
    select.innerHTML += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`;
    inputSelect.innerHTML += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`;
  });
}

/* ===================== ALTERNAR GRADE / FEED ===================== */
function initLayoutToggle() {
  currentLayout = localStorage.getItem("album_layout") || "grid";
  const buttons = document.querySelectorAll("#layout-toggle .toggle-btn");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.layout === currentLayout);
    btn.addEventListener("click", () => {
      currentLayout = btn.dataset.layout;
      localStorage.setItem("album_layout", currentLayout);
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyLayout();
    });
  });
  applyLayout();
}
function applyLayout() {
  document.getElementById("grid-all").classList.toggle("feed-view", currentLayout === "feed");
}

/* ===================== VIEW TOGGLES (linha do tempo / coleção) ===================== */
function initViewToggles() {
  document.querySelectorAll("#tab-linha .view-toggle .toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#tab-linha .view-toggle .toggle-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const isAlbum = btn.dataset.view === "album";
      document.getElementById("timeline-list").classList.toggle("hidden", isAlbum);
      document.getElementById("timeline-flipbook").classList.toggle("hidden", !isAlbum);
      if (isAlbum) renderFlipbook("timeline", sortedByDate(memories, "asc"));
    });
  });

  document.querySelectorAll("#collection-detail .view-toggle .toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#collection-detail .view-toggle .toggle-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const isAlbum = btn.dataset.view === "album";
      document.getElementById("collection-grid").classList.toggle("hidden", isAlbum);
      document.getElementById("collection-flipbook").classList.toggle("hidden", !isAlbum);
      if (isAlbum) renderFlipbook("collection", sortedByDate(memories.filter(m => m.collection === activeCollectionName), "asc"));
    });
  });

  document.getElementById("btn-back-collections").addEventListener("click", () => {
    document.getElementById("collection-detail").classList.add("hidden");
    document.getElementById("collections-grid").classList.remove("hidden");
  });
}

/* ===================== RENDER GERAL ===================== */
function renderAll() {
  renderGridAll();
  renderTimeline();
  renderCollectionsGrid();
}

function sortedByDate(list, order) {
  return [...list].sort((a, b) => order === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
}

/* ---- Todas as lembranças ---- */
function renderGridAll() {
  const grid = document.getElementById("grid-all");
  const search = document.getElementById("search-input").value.trim().toLowerCase();
  let list = sortedByDate(memories, currentSort);

  if (currentCollectionFilter) list = list.filter(m => m.collection === currentCollectionFilter);
  if (search) list = list.filter(m => m.title.toLowerCase().includes(search) || m.description.toLowerCase().includes(search));

  grid.innerHTML = "";
  list.forEach(m => grid.appendChild(buildMemoryCard(m)));
  document.getElementById("empty-all").classList.toggle("hidden", list.length > 0);
}

function buildMemoryCard(m) {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.innerHTML = `
    <div class="framed-media ${m.frame}"><div class="media-box">${mediaTag(m)}</div></div>
    <div class="card-body">
      <div class="card-title">${escapeHtml(m.title)}</div>
      <div class="card-date">${formatDate(m.date)}</div>
      <div class="card-tag">${escapeHtml(m.collection)}</div>
    </div>
  `;
  card.addEventListener("click", () => openDetail(m));
  return card;
}

function mediaTag(m) {
  return m.type === "video"
    ? `<video src="${m.media}" muted preload="metadata"></video>`
    : `<img src="${m.media}" alt="${escapeHtml(m.title)}" loading="lazy">`;
}

/* ---- Linha do tempo ---- */
function renderTimeline() {
  const container = document.getElementById("timeline-list");
  container.innerHTML = "";
  const list = sortedByDate(memories, "asc");
  let lastMonth = "";
  list.forEach(m => {
    const monthLabel = formatMonthYear(m.date);
    if (monthLabel !== lastMonth) {
      const h = document.createElement("div");
      h.className = "timeline-month";
      h.textContent = monthLabel;
      container.appendChild(h);
      lastMonth = monthLabel;
    }
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      ${m.type === "video" ? `<video class="thumb" src="${m.media}" muted></video>` : `<img class="thumb" src="${m.media}" alt="${escapeHtml(m.title)}">`}
      <div class="info">
        <h4>${escapeHtml(m.title)}</h4>
        <p>${formatDate(m.date)} · ${escapeHtml(m.collection)}</p>
        <p class="desc-preview">${escapeHtml(truncate(m.description, 110))}</p>
      </div>
    `;
    item.addEventListener("click", () => openDetail(m));
    container.appendChild(item);
  });
}

/* ---- Coleções ---- */
function renderCollectionsGrid() {
  const grid = document.getElementById("collections-grid");
  grid.innerHTML = "";
  const collections = [...new Set(memories.map(m => m.collection))];
  collections.forEach(name => {
    const items = memories.filter(m => m.collection === name);
    const cover = items.find(m => m.type === "image") || items[0];
    const card = document.createElement("div");
    card.className = "collection-card";
    card.innerHTML = `
      ${cover.type === "video" ? `<video src="${cover.media}" muted></video>` : `<img src="${cover.media}" alt="${escapeHtml(name)}">`}
      <div class="overlay">
        <h3>${escapeHtml(name)}</h3>
        <span>${items.length} lembrança${items.length > 1 ? "s" : ""}</span>
      </div>
    `;
    card.addEventListener("click", () => openCollection(name));
    grid.appendChild(card);
  });
}

function openCollection(name) {
  activeCollectionName = name;
  document.getElementById("collections-grid").classList.add("hidden");
  document.getElementById("collection-detail").classList.remove("hidden");
  document.getElementById("collection-title").textContent = name;

  // reset para visão em galeria
  document.querySelectorAll("#collection-detail .view-toggle .toggle-btn").forEach(b => b.classList.remove("active"));
  document.querySelector('#collection-detail .toggle-btn[data-view="grid"]').classList.add("active");
  document.getElementById("collection-grid").classList.remove("hidden");
  document.getElementById("collection-flipbook").classList.add("hidden");

  const grid = document.getElementById("collection-grid");
  grid.innerHTML = "";
  sortedByDate(memories.filter(m => m.collection === name), currentSort).forEach(m => grid.appendChild(buildMemoryCard(m)));
}

/* ===================== FLIPBOOK (álbum de páginas) ===================== */
function renderFlipbook(key, items) {
  const wrapId = key === "timeline" ? "timeline-flipbook" : "collection-flipbook";
  const wrap = document.getElementById(wrapId);
  flipbookState[key].items = items;
  flipbookState[key].index = 0;

  wrap.innerHTML = `
    <div class="flipbook-stage"><div class="flip-page" id="${key}-page"></div></div>
    <div class="flipbook-controls">
      <button id="${key}-prev">‹</button>
      <span class="page-count" id="${key}-count"></span>
      <button id="${key}-next">›</button>
    </div>
  `;

  paintFlipPage(key);
  document.getElementById(`${key}-prev`).addEventListener("click", (e) => { e.stopPropagation(); turnPage(key, -1); });
  document.getElementById(`${key}-next`).addEventListener("click", (e) => { e.stopPropagation(); turnPage(key, 1); });

  wrap.querySelector(".flipbook-stage").addEventListener("click", (e) => {
    if (e.target.closest("video")) return;
    const pageEl = document.getElementById(`${key}-page`);
    if (!pageEl || !pageEl.contains(e.target)) return;
    const rect = pageEl.getBoundingClientRect();
    const clickedRightHalf = (e.clientX - rect.left) > rect.width / 2;
    turnPage(key, clickedRightHalf ? 1 : -1);
  });
}

function paintFlipPage(key) {
  const { items, index } = flipbookState[key];
  const page = document.getElementById(`${key}-page`);
  const count = document.getElementById(`${key}-count`);
  if (!items.length) {
    page.innerHTML = `<p class="page-text">Nenhuma lembrança por aqui ainda 🌸</p>`;
    count.textContent = "";
    return;
  }
  const m = items[index];
  page.innerHTML = `
    <div class="page-media framed-media ${m.frame}"><div class="media-box">${mediaTag2(m)}</div></div>
    <span class="page-tag">${escapeHtml(m.collection)}</span>
    <h3>${escapeHtml(m.title)}</h3>
    <p class="page-date">${formatDate(m.date)}</p>
    <p class="page-text">${escapeHtml(m.description)}</p>
  `;
  count.textContent = `Página ${index + 1} de ${items.length}`;
  document.getElementById(`${key}-prev`).disabled = index === 0;
  document.getElementById(`${key}-next`).disabled = index === items.length - 1;
}

function mediaTag2(m) {
  return m.type === "video"
    ? `<video src="${m.media}" controls></video>`
    : `<img src="${m.media}" alt="${escapeHtml(m.title)}" draggable="false">`;
}

function turnPage(key, dir) {
  const state = flipbookState[key];
  const newIndex = state.index + dir;
  if (newIndex < 0 || newIndex >= state.items.length) return;
  const page = document.getElementById(`${key}-page`);
  page.classList.remove("turn-next", "turn-prev");
  page.classList.add(dir > 0 ? "turn-next" : "turn-prev");
  setTimeout(() => {
    state.index = newIndex;
    paintFlipPage(key);
    const freshPage = document.getElementById(`${key}-page`);
    freshPage.classList.remove("turn-next", "turn-prev");
    freshPage.style.transition = "none";
    freshPage.classList.add(dir > 0 ? "turn-prev" : "turn-next");
    requestAnimationFrame(() => {
      freshPage.style.transition = "";
      freshPage.classList.remove("turn-next", "turn-prev");
    });
  }, 420);
}

/* ===================== MODAIS ===================== */
function initModals() {
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
  document.getElementById("btn-add").addEventListener("click", () => openModal("modal-add"));
}
function openModal(id) { document.getElementById(id).classList.remove("hidden"); }
function closeModal(id) { document.getElementById(id).classList.add("hidden"); }

let currentDetailMemory = null;
function openDetail(m) {
  currentDetailMemory = m;
  document.getElementById("detail-media").innerHTML = m.type === "video"
    ? `<video src="${m.media}" controls autoplay></video>`
    : `<img src="${m.media}" alt="${escapeHtml(m.title)}">`;
  document.getElementById("detail-collection").textContent = m.collection;
  document.getElementById("detail-title").textContent = m.title;
  document.getElementById("detail-date").textContent = formatDate(m.date);
  document.getElementById("detail-description").textContent = m.description;
  document.getElementById("btn-delete-memory").classList.toggle("hidden", !!m.builtin);
  openModal("modal-detail");
}

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "btn-delete-memory" && currentDetailMemory) {
    const custom = loadCustomMemories().filter(m => m.id !== currentDetailMemory.id);
    saveCustomMemories(custom);
    memories = getAllMemories();
    closeModal("modal-detail");
    renderCollectionFilterOptions();
    renderAll();
  }
});

/* ===================== FORMULÁRIO NOVA LEMBRANÇA ===================== */
function initAddForm() {
  const frameOptions = document.querySelectorAll(".frame-option");
  frameOptions.forEach(btn => {
    btn.addEventListener("click", () => {
      frameOptions.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedFrame = btn.dataset.frame;
    });
  });
  frameOptions[0].classList.add("selected");

  document.getElementById("input-collection-select").addEventListener("change", (e) => {
    document.getElementById("wrap-new-collection").classList.toggle("hidden", e.target.value !== "__new__");
  });
  document.getElementById("wrap-new-collection").classList.remove("hidden");

  document.getElementById("input-media").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const preview = document.getElementById("file-preview");
    if (!file) { preview.classList.add("hidden"); return; }
    const url = URL.createObjectURL(file);
    preview.classList.remove("hidden");
    preview.innerHTML = file.type.startsWith("video")
      ? `<video src="${url}" controls></video>`
      : `<img src="${url}">`;
  });

  document.getElementById("form-add").addEventListener("submit", (e) => {
    e.preventDefault();
    const file = document.getElementById("input-media").files[0];
    if (!file) return;

    const select = document.getElementById("input-collection-select");
    const collection = select.value === "__new__"
      ? (document.getElementById("input-collection-new").value.trim() || "Sem coleção")
      : select.value;

    const reader = new FileReader();
    reader.onload = () => {
      const newMemory = {
        id: "custom-" + Date.now(),
        title: document.getElementById("input-title").value.trim(),
        collection,
        description: document.getElementById("input-description").value.trim(),
        date: document.getElementById("input-date").value,
        media: reader.result,
        type: file.type.startsWith("video") ? "video" : "image",
        frame: selectedFrame,
        builtin: false
      };
      const custom = loadCustomMemories();
      custom.push(newMemory);
      saveCustomMemories(custom);
      memories = getAllMemories();

      e.target.reset();
      document.getElementById("file-preview").classList.add("hidden");
      closeModal("modal-add");
      renderCollectionFilterOptions();
      renderAll();
    };
    reader.readAsDataURL(file);
  });
}

/* ===================== HELPERS ===================== */
function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function formatMonthYear(iso) {
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const [y, m] = iso.split("-");
  return `${meses[parseInt(m, 10) - 1]} de ${y}`;
}
function truncate(str, n) {
  return str.length > n ? str.slice(0, n).trim() + "…" : str;
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
