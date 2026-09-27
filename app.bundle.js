(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/core/dom.js
  var qs = (sel, root3 = document) => root3.querySelector(sel);
  var qsa = (sel, root3 = document) => Array.from(root3.querySelectorAll(sel));
  function el(tag, props = {}, children = []) {
    const [name, ...classes] = tag.split(".");
    const node = document.createElement(name || "div");
    if (classes.length) node.className = classes.join(" ");
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === "class" || key === "className") {
        node.className = (node.className ? node.className + " " : "") + value;
      } else if (key === "style" && typeof value === "object") {
        Object.assign(node.style, value);
      } else if (key === "dataset" && typeof value === "object") {
        Object.assign(node.dataset, value);
      } else if (key === "html") {
        node.innerHTML = value;
      } else if (key.startsWith("on") && typeof value === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (value === true) {
        node.setAttribute(key, "");
      } else {
        node.setAttribute(key, value);
      }
    }
    const list2 = Array.isArray(children) ? children : [children];
    for (const child of list2) {
      if (child == null || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  }
  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
    return node;
  }
  function setActive(nodes, activeNode, className = "is-active") {
    for (const n of nodes) n.classList.toggle(className, n === activeNode);
  }
  function formatDate(ts) {
    const d = new Date(ts);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  // src/components/icons.js
  var svg = (inner, extra = "") => `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ${extra}>${inner}</svg>`;
  var UI_ICONS = {
    play: svg(`<path d="M8 5.4v13.2L19 12 8 5.4Z" fill="currentColor"/>`),
    rocket: svg(`
    <path d="M12 2.6c3.4 2.2 5.2 5.6 5.2 9.3l1.9 2.6-3.1.8-1.3 3.1-2.7-1.9-2.7 1.9-1.3-3.1-3.1-.8 1.9-2.6c0-3.7 1.8-7.1 5.2-9.3Z" fill="currentColor"/>
    <circle cx="12" cy="10" r="1.9" style="fill: var(--strong-bg)"/>`),
    save: svg(`
    <path d="M5 4h11l3 3v13H5V4Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
    <path d="M8.5 4v5h7V4M8 13.5h8V20H8v-6.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>`),
    trash: svg(`
    <path d="M4.5 6.5h15M9.5 6.5V4.2h5v2.3M6.8 6.5l.9 13h8.6l.9-13" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`),
    copy: svg(`
    <rect x="8.4" y="8.4" width="11.2" height="11.2" rx="2.2" stroke="currentColor" stroke-width="1.9"/>
    <path d="M15.6 5.6V4.4H4.4v11.2h1.2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>`),
    undo: svg(`
    <path d="M9.5 8.5H15a4.5 4.5 0 1 1 0 9h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.2 5.3 8.6 8.6l3.6 3.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`),
    redo: svg(`
    <path d="M14.5 8.5H9a4.5 4.5 0 1 0 0 9h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.8 5.3l3.6 3.3-3.6 3.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`),
    grid: svg(`
    <path d="M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`),
    sound: svg(`
    <path d="M5 9.5h3.2L12.5 6v12L8.2 14.5H5v-5Z" fill="currentColor"/>
    <path d="M15.6 9.2a4 4 0 0 1 0 5.6M18.2 6.8a7.5 7.5 0 0 1 0 10.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`),
    mute: svg(`
    <path d="M5 9.5h3.2L12.5 6v12L8.2 14.5H5v-5Z" fill="currentColor"/>
    <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>`),
    edit: svg(`
    <path d="M4.5 19.5h4l10-10-4-4-10 10v4Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
    <path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="1.9"/>`),
    expand: svg(`
    <path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`),
    close: svg(`<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`),
    reset: svg(`
    <path d="M19 12a7 7 0 1 1-2.6-5.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M19.5 4v4.2h-4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`),
    gallery: svg(`
    <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2.4" stroke="currentColor" stroke-width="1.9"/>
    <path d="M3.6 15.4l4.6-4.2 3.6 3.2 3.2-2.8 5.4 4.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="8.6" cy="9.1" r="1.4" fill="currentColor"/>`),
    camera: svg(`
    <path d="M3.5 8.2c0-1 .8-1.8 1.8-1.8h2.3l1.5-2.2h5.8l1.5 2.2h2.3c1 0 1.8.8 1.8 1.8v9.6c0 1-.8 1.8-1.8 1.8H5.3c-1 0-1.8-.8-1.8-1.8V8.2Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
    <circle cx="12" cy="12.8" r="3.6" stroke="currentColor" stroke-width="1.9"/>`),
    print: svg(`
    <path d="M7 9V3.8h10V9M7 17H4.5V9.5h15V17H17" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
    <path d="M7 14h10v6.2H7V14Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>`),
    brush: svg(`
    <path d="M6.5 14.5c-1.8.5-2.4 2.2-2.6 4.6 2.6-.2 4.2-.9 4.7-2.7" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
    <path d="M9.4 16.1 7.4 14.1 16.9 4.6l2.5 2.5-10 9Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>`)
  };
  function uiIcon(name) {
    return UI_ICONS[name] || "";
  }

  // src/components/toast.js
  var root = null;
  var live = /* @__PURE__ */ new Map();
  function ensureRoot() {
    if (!root) root = qs("#toast-root") || document.body;
    return root;
  }
  function dismiss(key) {
    const entry = live.get(key);
    if (!entry) return;
    live.delete(key);
    entry.node.classList.remove("is-in");
    setTimeout(() => entry.node.remove(), 260);
  }
  function showToast(message, type = "info", ms = 2200) {
    const key = type + "|" + message;
    const existing = live.get(key);
    if (existing) {
      clearTimeout(existing.timer);
      existing.timer = setTimeout(() => dismiss(key), ms);
      return existing.node;
    }
    const node = el("div.toast.toast-" + type, {}, [message]);
    ensureRoot().append(node);
    void node.offsetWidth;
    node.classList.add("is-in");
    live.set(key, { node, timer: setTimeout(() => dismiss(key), ms) });
    return node;
  }

  // src/app/state.js
  var state_exports = {};
  __export(state_exports, {
    addPellet: () => addPellet,
    canRedo: () => canRedo,
    canUndo: () => canUndo,
    clearPellets: () => clearPellets,
    emitter: () => emitter,
    fillFreeSpots: () => fillFreeSpots,
    getSelected: () => getSelected,
    isFull: () => isFull,
    markSaved: () => markSaved,
    movePellet: () => movePellet,
    newShell: () => newShell,
    nudgePellet: () => nudgePellet,
    on: () => on,
    previewSpot: () => previewSpot,
    pushHistory: () => pushHistory,
    redo: () => redo,
    removePellet: () => removePellet,
    resetHistory: () => resetHistory,
    resolvePosition: () => resolvePosition,
    select: () => select,
    setPelletColor: () => setPelletColor,
    setShell: () => setShell,
    setShellName: () => setShellName,
    setTool: () => setTool,
    setView: () => setView,
    state: () => state,
    testPosition: () => testPosition,
    undo: () => undo
  });

  // src/core/events.js
  function createEmitter() {
    const map2 = /* @__PURE__ */ new Map();
    return {
      on(type, fn) {
        if (!map2.has(type)) map2.set(type, /* @__PURE__ */ new Set());
        map2.get(type).add(fn);
        return () => map2.get(type)?.delete(fn);
      },
      off(type, fn) {
        map2.get(type)?.delete(fn);
      },
      emit(type, payload) {
        const set = map2.get(type);
        if (!set) return;
        for (const fn of Array.from(set)) fn(payload);
      }
    };
  }

  // src/core/rng.js
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function rand() {
      a = a + 1831565813 >>> 0;
      let t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function uid(prefix = "fw") {
    return prefix + "_" + Date.now().toString(36) + "_" + Math.floor(Math.random() * 1e6).toString(36);
  }

  // src/data/pellet-colors.js
  var PELLET_COLORS = [
    {
      id: "red",
      name: "\u3042\u304B",
      swatch: "#ff3b4a",
      particles: ["#ff1a2e", "#ff3a44", "#ff5c48", "#ff8f63"],
      twinkle: 0.12,
      glow: 1
    },
    {
      id: "lemon",
      name: "\u30EC\u30E2\u30F3",
      swatch: "#f4ec4a",
      particles: ["#f2e800", "#f7ef3a", "#fbf673", "#fdfab0"],
      twinkle: 0.16,
      glow: 1.12
    },
    {
      id: "green",
      name: "\u307F\u3069\u308A",
      swatch: "#25cf6c",
      particles: ["#0ec95c", "#31e478", "#63f39c", "#a6ffc6"],
      twinkle: 0.12,
      glow: 1
    },
    {
      id: "purple",
      name: "\u3080\u3089\u3055\u304D",
      swatch: "#a862ff",
      particles: ["#8a33ff", "#a55cff", "#c188ff", "#dfb6ff"],
      twinkle: 0.14,
      glow: 1
    },
    {
      id: "blue",
      name: "\u3042\u304A",
      swatch: "#3b8dff",
      particles: ["#1a5cff", "#2f93ff", "#4fc0ff", "#8fd8ff"],
      twinkle: 0.14,
      glow: 1.05
    },
    {
      id: "white",
      name: "\u3057\u308D",
      swatch: "#f2f6ff",
      particles: ["#ffffff", "#eef4ff", "#d8e6ff", "#ffffff"],
      twinkle: 0.1,
      glow: 1.15
    }
  ];
  var PELLET_COLOR_COUNT = 6;
  var PELLET_COLOR_MAP = new Map(PELLET_COLORS.map((c) => [c.id, c]));
  var DEFAULT_PELLET_COLOR_ID = PELLET_COLORS[0].id;
  var COLOR_ALIASES = {
    yellow: "lemon",
    gold: "lemon",
    sparkle: "white"
  };
  function isPelletColorId(id) {
    return PELLET_COLOR_MAP.has(id);
  }
  function getPelletColor(id) {
    return PELLET_COLOR_MAP.get(id) || PELLET_COLOR_MAP.get(COLOR_ALIASES[id]) || PELLET_COLOR_MAP.get(DEFAULT_PELLET_COLOR_ID);
  }
  function resolvePelletColorId(id) {
    if (PELLET_COLOR_MAP.has(id)) return id;
    if (COLOR_ALIASES[id] && PELLET_COLOR_MAP.has(COLOR_ALIASES[id])) return COLOR_ALIASES[id];
    return DEFAULT_PELLET_COLOR_ID;
  }
  if (PELLET_COLORS.length !== PELLET_COLOR_COUNT) {
    console.warn(
      `[pellet-colors] \u661F\u306E\u8272\u306F ${PELLET_COLOR_COUNT} \u8272\u306E\u60F3\u5B9A\u3067\u3059\u304C ${PELLET_COLORS.length} \u8272\u3042\u308A\u307E\u3059`
    );
  }

  // src/types/shell.js
  var SHELL_DIAMETER_CM = 6;
  var SHELL_RADIUS_CM = SHELL_DIAMETER_CM / 2;
  var PELLET_DIAMETER_CM = 1;
  var PELLET_RADIUS_CM = PELLET_DIAMETER_CM / 2;
  var MAX_PELLET_CENTER_R_CM = SHELL_RADIUS_CM - PELLET_RADIUS_CM;
  var MIN_PELLET_GAP_CM = PELLET_DIAMETER_CM;
  var EPS = 1e-6;
  var MAX_PELLETS = 24;
  function isInsideShell(x, y) {
    return Math.hypot(x, y) <= MAX_PELLET_CENTER_R_CM + EPS;
  }
  function canPlacePellet(x, y, existingPellets = [], opts = {}) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return { ok: false, reason: "outside" };
    }
    if (!isInsideShell(x, y)) {
      return { ok: false, reason: "outside" };
    }
    for (const p of existingPellets) {
      if (opts.ignoreId && p.id === opts.ignoreId) continue;
      if (Math.hypot(p.x - x, p.y - y) < MIN_PELLET_GAP_CM - EPS) {
        return { ok: false, reason: "overlap", conflictId: p.id };
      }
    }
    const count = opts.ignoreId ? existingPellets.filter((p) => p.id !== opts.ignoreId).length : existingPellets.length;
    if (count >= MAX_PELLETS) return { ok: false, reason: "full" };
    return { ok: true };
  }
  var PLACE_ERROR_TEXT = {
    outside: "\u305F\u307E\u304C \u307E\u308B\u304B\u3089 \u306F\u307F\u3060\u3057\u3061\u3083\u3046",
    overlap: "\u305F\u307E\u304C \u304B\u3055\u306A\u3063\u3061\u3083\u3046",
    full: "\u3082\u3046 \u307B\u3057\u3092 \u304A\u304F \u3070\u3057\u3087\u304C \u306A\u3044\u3088"
  };
  function createPellet(x, y, color) {
    return {
      id: uid("pel"),
      x: round4(x),
      y: round4(y),
      color: resolvePelletColorId(color)
    };
  }
  function createShell(partial = {}) {
    const shell = {
      id: partial.id || uid("shell"),
      name: partial.name || "\u306A\u307E\u3048\u306E\u306A\u3044 \u305F\u307E",
      pellets: [],
      createdAt: partial.createdAt || Date.now(),
      updatedAt: partial.updatedAt || Date.now()
    };
    for (const raw of partial.pellets || []) {
      const p = createPellet(Number(raw.x), Number(raw.y), raw.color);
      if (raw.id) p.id = raw.id;
      if (canPlacePellet(p.x, p.y, shell.pellets).ok) shell.pellets.push(p);
    }
    return shell;
  }
  function cloneShell(shell) {
    return {
      id: shell.id,
      name: shell.name,
      pellets: shell.pellets.map((p) => ({ ...p })),
      createdAt: shell.createdAt,
      updatedAt: shell.updatedAt
    };
  }
  function normalizeShell(raw) {
    return createShell({
      id: raw?.id,
      name: typeof raw?.name === "string" && raw.name.trim() ? raw.name : "\u306A\u307E\u3048\u306E\u306A\u3044 \u305F\u307E",
      pellets: Array.isArray(raw?.pellets) ? raw.pellets : [],
      createdAt: Number(raw?.createdAt) || Date.now(),
      updatedAt: Number(raw?.updatedAt) || Date.now()
    });
  }
  var _slots = null;
  var SLOT_SPACING_CM = MIN_PELLET_GAP_CM * 1.004;
  function hexSlots() {
    if (_slots) return _slots;
    const out = [];
    const a = SLOT_SPACING_CM;
    const dy = a * (Math.sqrt(3) / 2);
    for (let row = -3; row <= 3; row++) {
      const y = row * dy;
      const offset = (row & 1) === 0 ? 0 : 0.5;
      for (let col = -4; col <= 4; col++) {
        const x = (col + offset) * a;
        if (Math.hypot(x, y) <= MAX_PELLET_CENTER_R_CM + EPS) out.push({ x: round4(x), y: round4(y) });
      }
    }
    _slots = out;
    return out;
  }
  function slotAt(row, col) {
    const a = SLOT_SPACING_CM;
    const offset = (row & 1) === 0 ? 0 : 0.5;
    return { x: round4((col + offset) * a), y: round4(row * a * (Math.sqrt(3) / 2)) };
  }
  function findFreeSpot(pellets) {
    for (const s of hexSlots()) {
      if (canPlacePellet(s.x, s.y, pellets).ok) return { x: s.x, y: s.y };
    }
    const RINGS = 9;
    for (let ri = 0; ri <= RINGS; ri++) {
      const r = MAX_PELLET_CENTER_R_CM * ri / RINGS;
      const steps = Math.max(1, Math.round(2 * Math.PI * r / 0.25));
      for (let i = 0; i < steps; i++) {
        const a = i / steps * Math.PI * 2 + ri * 0.37;
        const x = round4(Math.cos(a) * r);
        const y = round4(Math.sin(a) * r);
        if (canPlacePellet(x, y, pellets).ok) return { x, y };
      }
    }
    return null;
  }
  function round4(v) {
    return Math.round(v * 1e4) / 1e4;
  }
  function findNearbySpot(x, y, pellets = [], opts = {}) {
    const maxDist = opts.maxDist ?? 0.9;
    const ignoreId = opts.ignoreId;
    if (canPlacePellet(x, y, pellets, { ignoreId }).ok) {
      return { x: round4(x), y: round4(y), snapped: false };
    }
    const tries = [];
    const r = Math.hypot(x, y);
    if (r > MAX_PELLET_CENTER_R_CM && r > EPS) {
      const k = MAX_PELLET_CENTER_R_CM / r;
      tries.push({ x: x * k, y: y * k });
    }
    for (let d = 0.1; d <= maxDist + EPS; d += 0.1) {
      const steps = Math.max(8, Math.round(TAU_CM * d / 0.12));
      for (let i = 0; i < steps; i++) {
        const a = i / steps * TAU_CM + d * 3.1;
        tries.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d });
      }
    }
    for (const t of tries) {
      const tx = round4(t.x);
      const ty = round4(t.y);
      if (canPlacePellet(tx, ty, pellets, { ignoreId }).ok) {
        return { x: tx, y: ty, snapped: true };
      }
    }
    return null;
  }
  var TAU_CM = Math.PI * 2;
  function isShellFull(pellets = []) {
    if (pellets.length >= MAX_PELLETS) return true;
    return findFreeSpot(pellets) === null;
  }

  // src/storage/storage.js
  var storage_exports = {};
  __export(storage_exports, {
    clearAllShells: () => clearAllShells,
    clearDraft: () => clearDraft,
    deleteShell: () => deleteShell,
    duplicateShell: () => duplicateShell,
    exportAll: () => exportAll,
    getSettings: () => getSettings,
    getShellRecord: () => getShellRecord,
    importAll: () => importAll,
    isStorageAvailable: () => isStorageAvailable,
    listShells: () => listShells,
    loadDraft: () => loadDraft,
    saveDraft: () => saveDraft,
    saveShell: () => saveShell,
    setSettings: () => setSettings
  });
  var NS = "digital-fireworks.v2";
  var K_SHELLS = NS + ".shells";
  var K_SETTINGS = NS + ".settings";
  var K_DRAFT = NS + ".draft";
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("[storage] \u8AAD\u307F\u8FBC\u307F\u5931\u6557", key, e);
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("[storage] \u4FDD\u5B58\u5931\u6557", key, e);
      return false;
    }
  }
  function isStorageAvailable() {
    try {
      const t = NS + ".test";
      localStorage.setItem(t, "1");
      localStorage.removeItem(t);
      return true;
    } catch {
      return false;
    }
  }
  function listShells() {
    const raw = readJSON(K_SHELLS, []);
    if (!Array.isArray(raw)) return [];
    return raw.filter((r) => r && r.shell).map((r) => {
      const shell = normalizeShell(r.shell);
      return {
        id: r.id || shell.id,
        name: r.name || shell.name,
        shell,
        thumbnail: typeof r.thumbnail === "string" ? r.thumbnail : "",
        createdAt: Number(r.createdAt) || Date.now(),
        updatedAt: Number(r.updatedAt) || Number(r.createdAt) || Date.now()
      };
    }).sort((a, b) => b.updatedAt - a.updatedAt);
  }
  function getShellRecord(id) {
    return listShells().find((r) => r.id === id) || null;
  }
  function saveShell(shell, thumbnail = "") {
    const all = listShells();
    const now = Date.now();
    const idx = all.findIndex((r) => r.id === shell.id);
    const stored = cloneShell(shell);
    stored.updatedAt = now;
    const record = {
      id: shell.id,
      name: shell.name,
      shell: stored,
      thumbnail,
      createdAt: idx >= 0 ? all[idx].createdAt : now,
      updatedAt: now
    };
    if (idx >= 0) all[idx] = record;
    else all.unshift(record);
    if (!writeJSON(K_SHELLS, all)) {
      const slim = all.map((r) => ({ ...r, thumbnail: r.id === record.id ? thumbnail : "" }));
      if (!writeJSON(K_SHELLS, slim)) {
        return { ok: false, error: "\u307B\u305E\u3093\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08\u3088\u3046\u308A\u3087\u3046\u4E0D\u8DB3\u304B\u3082\uFF09" };
      }
    }
    return { ok: true, record };
  }
  function deleteShell(id) {
    return writeJSON(K_SHELLS, listShells().filter((r) => r.id !== id));
  }
  function duplicateShell(id) {
    const src = getShellRecord(id);
    if (!src) return null;
    const copy = cloneShell(src.shell);
    copy.id = uid("shell");
    copy.name = src.name + " \u306E\u30B3\u30D4\u30FC";
    copy.pellets = copy.pellets.map((p) => ({ ...p, id: uid("pel") }));
    const res = saveShell(copy, src.thumbnail);
    return res.ok ? res.record : null;
  }
  function clearAllShells() {
    return writeJSON(K_SHELLS, []);
  }
  var DEFAULT_SETTINGS = {
    sound: true,
    activeColor: DEFAULT_PELLET_COLOR_ID
  };
  function getSettings() {
    const s = { ...DEFAULT_SETTINGS, ...readJSON(K_SETTINGS, {}) };
    if (!isPelletColorId(s.activeColor)) s.activeColor = DEFAULT_PELLET_COLOR_ID;
    return s;
  }
  function setSettings(patch) {
    const next = { ...getSettings(), ...patch };
    writeJSON(K_SETTINGS, next);
    return next;
  }
  function saveDraft(shell) {
    writeJSON(K_DRAFT, { shell: cloneShell(shell), savedAt: Date.now() });
  }
  function loadDraft() {
    const d = readJSON(K_DRAFT, null);
    if (!d || !d.shell) return null;
    try {
      return normalizeShell(d.shell);
    } catch {
      return null;
    }
  }
  function clearDraft() {
    try {
      localStorage.removeItem(K_DRAFT);
    } catch {
    }
  }
  function exportAll() {
    return JSON.stringify({ app: "digital-fireworks", version: 2, shells: listShells() }, null, 2);
  }
  function importAll(json, { merge = true } = {}) {
    let data;
    try {
      data = JSON.parse(json);
    } catch {
      return { ok: false, error: "JSON \u304C\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F" };
    }
    const incomingRaw = Array.isArray(data?.shells) ? data.shells : null;
    if (!incomingRaw) return { ok: false, error: "\u5F62\u5F0F\u304C\u3061\u304C\u3044\u307E\u3059" };
    const incoming = incomingRaw.map((r) => {
      const shell = normalizeShell(r.shell || r);
      return {
        id: r.id || shell.id,
        name: r.name || shell.name,
        shell,
        thumbnail: r.thumbnail || "",
        createdAt: Number(r.createdAt) || Date.now(),
        updatedAt: Number(r.updatedAt) || Date.now()
      };
    });
    const base = merge ? listShells() : [];
    const byId = new Map(base.map((r) => [r.id, r]));
    for (const r of incoming) byId.set(r.id, r);
    writeJSON(K_SHELLS, Array.from(byId.values()));
    return { ok: true, count: incoming.length };
  }

  // src/app/state.js
  var HISTORY_LIMIT = 80;
  var emitter = createEmitter();
  var on = emitter.on;
  var settings = getSettings();
  var state = {
    /** @type {import('../types/shell.js').FireworkShell} 編集中の2.5号玉 */
    shell: createShell({ name: "\u308F\u305F\u3057\u306E\u82B1\u706B" }),
    selectedPelletId: null,
    activeColor: settings.activeColor && isPelletColorId(settings.activeColor) ? settings.activeColor : DEFAULT_PELLET_COLOR_ID,
    sound: settings.sound ?? true,
    dirty: false
  };
  var past = [];
  var future = [];
  function snapshot() {
    return { shell: cloneShell(state.shell), selectedPelletId: state.selectedPelletId };
  }
  function pushHistory() {
    past.push(snapshot());
    if (past.length > HISTORY_LIMIT) past.shift();
    future.length = 0;
    emitter.emit("history");
  }
  var canUndo = () => past.length > 0;
  var canRedo = () => future.length > 0;
  function undo() {
    if (!past.length) return false;
    future.push(snapshot());
    const s = past.pop();
    state.shell = s.shell;
    state.selectedPelletId = s.selectedPelletId;
    markDirty();
    emitChange();
    emitter.emit("history");
    return true;
  }
  function redo() {
    if (!future.length) return false;
    past.push(snapshot());
    const s = future.pop();
    state.shell = s.shell;
    state.selectedPelletId = s.selectedPelletId;
    markDirty();
    emitChange();
    emitter.emit("history");
    return true;
  }
  function resetHistory() {
    past = [];
    future = [];
    emitter.emit("history");
  }
  function markDirty() {
    state.dirty = true;
    saveDraft(state.shell);
  }
  function emitChange() {
    emitter.emit("change", state.shell);
    emitter.emit("select", getSelected());
  }
  function setShell(shell, { dirty = false } = {}) {
    state.shell = cloneShell(shell);
    state.selectedPelletId = null;
    resetHistory();
    state.dirty = dirty;
    saveDraft(state.shell);
    emitChange();
  }
  function setShellName(name) {
    if (state.shell.name === name) return;
    pushHistory();
    state.shell.name = name;
    markDirty();
    emitChange();
  }
  function getSelected() {
    return state.shell.pellets.find((p) => p.id === state.selectedPelletId) || null;
  }
  function select(id) {
    if (state.selectedPelletId === id) return;
    state.selectedPelletId = id;
    emitter.emit("select", getSelected());
    emitter.emit("change", state.shell);
  }
  function resolvePosition(x, y) {
    return isInsideShell(x, y) ? { x, y } : { x, y, outside: true };
  }
  function previewSpot(x, y, ignoreId) {
    if (canPlacePellet(x, y, state.shell.pellets, { ignoreId }).ok) {
      return { x, y, snapped: false };
    }
    return findNearbySpot(x, y, state.shell.pellets, { ignoreId });
  }
  function addPellet(x, y, colorId = state.activeColor, { snap = true } = {}) {
    const direct = canPlacePellet(x, y, state.shell.pellets);
    let spot = direct.ok ? { x, y, snapped: false } : null;
    if (!spot && snap) spot = findNearbySpot(x, y, state.shell.pellets);
    if (!spot) {
      const reason = isInsideShell(x, y) && isShellFull(state.shell.pellets) ? "full" : direct.reason || "outside";
      const check = { ...direct, ok: false, reason };
      emitter.emit("reject", check);
      return check;
    }
    pushHistory();
    const pellet = createPellet(spot.x, spot.y, colorId);
    state.shell.pellets.push(pellet);
    state.selectedPelletId = pellet.id;
    markDirty();
    emitChange();
    return { ok: true, pellet };
  }
  function movePellet(id, x, y, { history = true, snap = false } = {}) {
    const pellet = state.shell.pellets.find((p) => p.id === id);
    if (!pellet) return { ok: false, reason: "missing" };
    const direct = canPlacePellet(x, y, state.shell.pellets, { ignoreId: id });
    let spot = direct.ok ? { x, y } : null;
    if (!spot && snap) spot = findNearbySpot(x, y, state.shell.pellets, { ignoreId: id });
    if (!spot) {
      emitter.emit("reject", direct);
      return direct;
    }
    if (pellet.x === spot.x && pellet.y === spot.y) return { ok: true };
    if (history) pushHistory();
    pellet.x = spot.x;
    pellet.y = spot.y;
    markDirty();
    emitChange();
    return { ok: true };
  }
  function testPosition(x, y, ignoreId) {
    const pos = resolvePosition(x, y);
    const check = pos.outside ? { ok: false, reason: "outside" } : canPlacePellet(pos.x, pos.y, state.shell.pellets, { ignoreId });
    return { ...pos, ...check };
  }
  function setPelletColor(id, colorId) {
    const pellet = state.shell.pellets.find((p) => p.id === id);
    if (!pellet || pellet.color === colorId || !isPelletColorId(colorId)) return false;
    pushHistory();
    pellet.color = colorId;
    markDirty();
    emitChange();
    return true;
  }
  function removePellet(id) {
    const i = state.shell.pellets.findIndex((p) => p.id === id);
    if (i < 0) return false;
    pushHistory();
    state.shell.pellets.splice(i, 1);
    if (state.selectedPelletId === id) state.selectedPelletId = null;
    markDirty();
    emitChange();
    return true;
  }
  function clearPellets() {
    if (!state.shell.pellets.length) return;
    pushHistory();
    state.shell.pellets = [];
    state.selectedPelletId = null;
    markDirty();
    emitChange();
  }
  function fillFreeSpots(colorId = state.activeColor) {
    let added = 0;
    let first = true;
    while (state.shell.pellets.length < MAX_PELLETS) {
      const spot = findFreeSpot(state.shell.pellets);
      if (!spot) break;
      if (first) {
        pushHistory();
        first = false;
      }
      state.shell.pellets.push(createPellet(spot.x, spot.y, colorId));
      added++;
    }
    if (!added) {
      emitter.emit("reject", { ok: false, reason: "full" });
      return 0;
    }
    markDirty();
    emitChange();
    return added;
  }
  function nudgePellet(id, dx, dy) {
    const p = state.shell.pellets.find((q) => q.id === id);
    if (!p) return false;
    const res = movePellet(id, p.x + dx, p.y + dy);
    return res.ok;
  }
  function setTool(patch) {
    let changed = false;
    if (patch.activeColor && isPelletColorId(patch.activeColor) && state.activeColor !== patch.activeColor) {
      state.activeColor = patch.activeColor;
      changed = true;
    }
    if (changed) {
      setSettings({ activeColor: state.activeColor });
      emitter.emit("tool", state);
    }
    return changed;
  }
  function setView(patch) {
    let changed = false;
    for (const k of ["sound"]) {
      if (patch[k] != null && state[k] !== patch[k]) {
        state[k] = patch[k];
        changed = true;
      }
    }
    if (changed) {
      setSettings({ sound: state.sound });
      emitter.emit("view", state);
      emitter.emit("change", state.shell);
    }
    return changed;
  }
  function isFull() {
    return isShellFull(state.shell.pellets);
  }
  function markSaved() {
    state.dirty = false;
    emitter.emit("saved", state.shell);
  }
  function newShell() {
    setShell(createShell({ id: uid("shell"), name: "\u308F\u305F\u3057\u306E\u82B1\u706B" }));
  }

  // src/components/modal.js
  function root2() {
    return qs("#modal-root") || document.body;
  }
  function openModal({ title, body, actions = [], wide = false, onClose }) {
    const backdrop = el("div.modal-backdrop");
    const panel = el("div.modal" + (wide ? ".modal-wide" : ""), { role: "dialog", "aria-modal": "true" });
    const close = (value) => {
      backdrop.classList.remove("is-in");
      setTimeout(() => backdrop.remove(), 180);
      document.removeEventListener("keydown", onKey);
      onClose?.(value);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(void 0);
      }
    };
    const head = el("div.modal-head", {}, [
      el("h2.modal-title", {}, [title || ""]),
      el("button.icon-btn.modal-close", {
        type: "button",
        title: "\u3068\u3058\u308B",
        html: uiIcon("close"),
        onClick: () => close(void 0)
      })
    ]);
    const bodyNode = el("div.modal-body");
    if (body instanceof Node) bodyNode.append(body);
    else if (body != null) bodyNode.append(document.createTextNode(String(body)));
    const foot = el("div.modal-foot");
    for (const a of actions) {
      foot.append(
        el(
          "button.btn" + (a.variant ? ".btn-" + a.variant : ""),
          { type: "button", onClick: () => a.onClick ? a.onClick(close) : close(a.value) },
          [a.label]
        )
      );
    }
    panel.append(head, bodyNode);
    if (actions.length) panel.append(foot);
    backdrop.append(panel);
    backdrop.addEventListener("mousedown", (e) => {
      if (e.target === backdrop) close(void 0);
    });
    root2().append(backdrop);
    void backdrop.offsetWidth;
    backdrop.classList.add("is-in");
    document.addEventListener("keydown", onKey);
    return { close, panel, body: bodyNode };
  }
  function confirmDialog({ title, message, okLabel = "\u306F\u3044", cancelLabel = "\u3084\u3081\u308B", danger = false }) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (v) => {
        if (settled) return;
        settled = true;
        resolve(v);
      };
      openModal({
        title,
        body: el("p.modal-text", {}, [message]),
        actions: [
          { label: cancelLabel, variant: "ghost", onClick: (close) => {
            done(false);
            close();
          } },
          {
            label: okLabel,
            variant: danger ? "danger" : "primary",
            onClick: (close) => {
              done(true);
              close();
            }
          }
        ],
        onClose: () => done(false)
      });
    });
  }
  function promptDialog({ title, label, value = "", placeholder = "", okLabel = "\u3051\u3063\u3066\u3044" }) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (v) => {
        if (settled) return;
        settled = true;
        resolve(v);
      };
      const input = el("input.text-input", {
        type: "text",
        value,
        placeholder,
        maxlength: "40"
      });
      const wrap = el("div.form-row", {}, [label ? el("label.form-label", {}, [label]) : null, input]);
      const m = openModal({
        title,
        body: wrap,
        actions: [
          { label: "\u3084\u3081\u308B", variant: "ghost", onClick: (close) => {
            done(null);
            close();
          } },
          {
            label: okLabel,
            variant: "primary",
            onClick: (close) => {
              done(input.value.trim() || value || "");
              close();
            }
          }
        ],
        onClose: () => done(null)
      });
      setTimeout(() => {
        input.focus();
        input.select();
      }, 60);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          done(input.value.trim() || value || "");
          m.close();
        }
      });
    });
  }

  // src/components/shell-render.js
  function drawShell(ctx2, shell, cx, cy, rPx, opts = {}) {
    const k = rPx / SHELL_RADIUS_CM;
    const pelletR = PELLET_RADIUS_CM * k;
    ctx2.save();
    if (opts.showCase) {
      const g = ctx2.createRadialGradient(cx, cy - rPx * 0.25, rPx * 0.1, cx, cy, rPx);
      g.addColorStop(0, "rgba(38,50,86,0.95)");
      g.addColorStop(1, "rgba(16,22,44,0.95)");
      ctx2.fillStyle = g;
      ctx2.beginPath();
      ctx2.arc(cx, cy, rPx, 0, Math.PI * 2);
      ctx2.fill();
      ctx2.strokeStyle = "rgba(170,200,255,0.55)";
      ctx2.lineWidth = Math.max(1.5, rPx * 0.016);
      ctx2.stroke();
    }
    if (opts.showLimit) {
      ctx2.strokeStyle = "rgba(150,185,255,0.22)";
      ctx2.lineWidth = Math.max(1, rPx * 6e-3);
      ctx2.setLineDash([rPx * 0.05, rPx * 0.04]);
      ctx2.beginPath();
      ctx2.arc(cx, cy, MAX_PELLET_CENTER_R_CM * k, 0, Math.PI * 2);
      ctx2.stroke();
      ctx2.setLineDash([]);
    }
    if (opts.conflictId) {
      const c = shell.pellets.find((p) => p.id === opts.conflictId);
      if (c) {
        const gx = cx + c.x * k;
        const gy = cy + c.y * k;
        ctx2.fillStyle = "rgba(255,70,88,0.13)";
        ctx2.beginPath();
        ctx2.arc(gx, gy, MIN_PELLET_GAP_CM * k, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.strokeStyle = "rgba(255,110,125,0.7)";
        ctx2.lineWidth = Math.max(1.5, pelletR * 0.12);
        ctx2.setLineDash([pelletR * 0.4, pelletR * 0.3]);
        ctx2.beginPath();
        ctx2.arc(gx, gy, MIN_PELLET_GAP_CM * k, 0, Math.PI * 2);
        ctx2.stroke();
        ctx2.setLineDash([]);
      }
    }
    if (opts.dim) ctx2.globalAlpha = 0.5;
    for (const p of shell.pellets) {
      drawPellet(ctx2, cx + p.x * k, cy + p.y * k, pelletR, getPelletColor(p.color).swatch, {
        selected: p.id === opts.selectedId,
        hovered: p.id === opts.hoverId,
        conflict: p.id === opts.conflictId
      });
    }
    ctx2.globalAlpha = 1;
    if (opts.ghost) {
      const gx = cx + opts.ghost.x * k;
      const gy = cy + opts.ghost.y * k;
      if (opts.ghost.valid) {
        ctx2.globalAlpha = 0.55;
        drawPellet(ctx2, gx, gy, pelletR, getPelletColor(opts.ghost.color).swatch, {});
        ctx2.globalAlpha = 1;
      } else {
        ctx2.fillStyle = "rgba(255,70,88,0.34)";
        ctx2.beginPath();
        ctx2.arc(gx, gy, pelletR, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.strokeStyle = "rgba(255,120,130,0.95)";
        ctx2.lineWidth = Math.max(2, pelletR * 0.16);
        ctx2.stroke();
        const c = pelletR * 0.45;
        ctx2.beginPath();
        ctx2.moveTo(gx - c, gy - c);
        ctx2.lineTo(gx + c, gy + c);
        ctx2.moveTo(gx + c, gy - c);
        ctx2.lineTo(gx - c, gy + c);
        ctx2.stroke();
      }
    }
    ctx2.restore();
  }
  function drawPellet(ctx2, x, y, r, css, { selected, hovered, conflict } = {}) {
    const g = ctx2.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.35, css);
    g.addColorStop(1, shade(css, -0.32));
    ctx2.fillStyle = g;
    ctx2.beginPath();
    ctx2.arc(x, y, r, 0, Math.PI * 2);
    ctx2.fill();
    ctx2.strokeStyle = conflict ? "rgba(255,90,105,0.95)" : selected ? "rgba(255,255,255,0.98)" : hovered ? "rgba(255,255,255,0.6)" : "rgba(10,16,34,0.45)";
    ctx2.lineWidth = Math.max(1, r * (selected || conflict ? 0.22 : 0.1));
    ctx2.beginPath();
    ctx2.arc(x, y, r * (selected ? 0.94 : 1), 0, Math.PI * 2);
    ctx2.stroke();
    if (selected) {
      ctx2.strokeStyle = "rgba(255,255,255,0.55)";
      ctx2.lineWidth = Math.max(1, r * 0.1);
      ctx2.setLineDash([r * 0.35, r * 0.3]);
      ctx2.beginPath();
      ctx2.arc(x, y, r * 1.35, 0, Math.PI * 2);
      ctx2.stroke();
      ctx2.setLineDash([]);
    }
  }
  function renderShellThumbnail(shell, size = 192) {
    const cv = document.createElement("canvas");
    cv.width = size;
    cv.height = size;
    const ctx2 = cv.getContext("2d");
    ctx2.fillStyle = "#080d1c";
    ctx2.fillRect(0, 0, size, size);
    drawShell(ctx2, shell, size / 2, size / 2, size * 0.44, { showCase: true });
    try {
      return cv.toDataURL("image/jpeg", 0.8);
    } catch {
      return "";
    }
  }
  function shade(hex, amount) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + 255 * amount)));
    return `rgb(${f(n >> 16 & 255)},${f(n >> 8 & 255)},${f(n & 255)})`;
  }

  // src/shell-editor/shell-canvas.js
  var ShellCanvas = class {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.dpr = 1;
      this.cx = 0;
      this.cy = 0;
      this.rPx = 1;
      this._shell = { pellets: [] };
      this._opts = {};
      this.resize();
    }
    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.dpr = dpr;
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w;
        this.canvas.height = h;
      }
      this.cx = w / 2;
      this.cy = h / 2;
      this.rPx = Math.min(w, h) * 0.44;
      this.render(this._shell, this._opts);
    }
    /** cm -> px 係数 */
    get scale() {
      return this.rPx / SHELL_RADIUS_CM;
    }
    render(shell, opts = {}) {
      this._shell = shell;
      this._opts = opts;
      const ctx2 = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx2.setTransform(1, 0, 0, 1, 0, 0);
      ctx2.clearRect(0, 0, w, h);
      const halo = ctx2.createRadialGradient(this.cx, this.cy, this.rPx * 0.6, this.cx, this.cy, this.rPx * 1.6);
      halo.addColorStop(0, "rgba(70,110,200,0.18)");
      halo.addColorStop(1, "rgba(70,110,200,0)");
      ctx2.fillStyle = halo;
      ctx2.fillRect(0, 0, w, h);
      drawShell(ctx2, shell, this.cx, this.cy, this.rPx, {
        showCase: true,
        showLimit: true,
        selectedId: opts.selectedId,
        hoverId: opts.hoverId,
        conflictId: opts.conflictId,
        ghost: opts.ghost
      });
      if (opts.dragOrigin) {
        const k = this.scale;
        ctx2.save();
        ctx2.setLineDash([this.rPx * 0.03, this.rPx * 0.025]);
        ctx2.strokeStyle = "rgba(255,255,255,0.35)";
        ctx2.lineWidth = Math.max(1, this.rPx * 8e-3);
        ctx2.beginPath();
        ctx2.arc(
          this.cx + opts.dragOrigin.x * k,
          this.cy + opts.dragOrigin.y * k,
          PELLET_RADIUS_CM * k,
          0,
          Math.PI * 2
        );
        ctx2.stroke();
        ctx2.restore();
      }
    }
    /** 画面座標 -> 玉中心基準の cm */
    clientToCm(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      const px = (clientX - rect.left) * this.dpr;
      const py = (clientY - rect.top) * this.dpr;
      const k = this.scale;
      return { x: (px - this.cx) / k, y: (py - this.cy) / k };
    }
    /** その座標にある珠 */
    hitTest(xCm, yCm, shell) {
      let best = null;
      let bestD = Infinity;
      for (const p of shell.pellets) {
        const d = Math.hypot(p.x - xCm, p.y - yCm);
        if (d <= PELLET_RADIUS_CM * 1.1 && d < bestD) {
          bestD = d;
          best = p;
        }
      }
      return best;
    }
  };

  // src/data/shell-presets.js
  function P(list2) {
    return list2.map(([row, col, color]) => {
      const { x, y } = slotAt(row, col);
      return { x, y, color };
    });
  }
  var RING = [
    [-2, -1],
    [-2, 0],
    [-2, 1],
    [-1, -2],
    [-1, 1],
    [0, -2],
    [0, 2],
    [1, -2],
    [1, 1],
    [2, -1],
    [2, 0],
    [2, 1]
  ];
  var ALL = [
    [-2, -1],
    [-2, 0],
    [-2, 1],
    [-1, -2],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [0, -1],
    [0, 0],
    [0, 1],
    [0, 2],
    [1, -2],
    [1, -1],
    [1, 0],
    [1, 1],
    [2, -1],
    [2, 0],
    [2, 1]
  ];
  var withColor = (cells, color) => cells.map(([r, c]) => [r, c, color]);
  var SHELL_PRESETS = [
    {
      id: "blank",
      name: "\u304B\u3089\u3063\u307D",
      hint: "\u306A\u306B\u3082\u306A\u3044 \u305F\u307E\u304B\u3089 \u3064\u304F\u308B",
      pellets: []
    },
    {
      id: "full",
      name: "\u307E\u3093\u307E\u308B",
      hint: "\u305F\u307E\u3092 \u304E\u3063\u3057\u308A \u3064\u3081\u305F \u83CA",
      pellets: P(withColor(ALL, "lemon"))
    },
    {
      id: "ring",
      name: "\u308F\u3063\u304B",
      hint: "\u307E\u308F\u308A\u3060\u3051 \u306B \u305F\u307E\u3092 \u304A\u304F",
      pellets: P(withColor(RING, "blue"))
    },
    {
      id: "heart",
      name: "\u30CF\u30FC\u30C8",
      hint: "\u3057\u305F\u304C \u3068\u304C\u3063\u305F \u30CF\u30FC\u30C8",
      pellets: P([
        ...withColor([[-2, -1], [-2, 1]], "red"),
        ...withColor([[-1, -2], [-1, -1], [-1, 0], [-1, 1]], "red"),
        ...withColor([[0, -2], [0, -1], [0, 1], [0, 2]], "red"),
        ...withColor([[0, 0]], "white"),
        ...withColor([[1, -1], [1, 0]], "red"),
        ...withColor([[2, 0]], "red")
      ])
    },
    {
      id: "star",
      name: "\u307B\u3057",
      hint: "\u3054\u307C\u3046\u305B\u3044\u306E \u304B\u305F\u3061",
      pellets: P([
        ...withColor([[-2, 0]], "lemon"),
        ...withColor([[-1, -1], [-1, 0]], "lemon"),
        ...withColor([[0, -2], [0, -1], [0, 1], [0, 2]], "lemon"),
        ...withColor([[0, 0]], "white"),
        ...withColor([[1, -1], [1, 0]], "lemon"),
        ...withColor([[2, -1], [2, 1]], "lemon")
      ])
    },
    {
      id: "smile",
      name: "\u306B\u3053\u3061\u3083\u3093",
      hint: "\u3081\u3068 \u304F\u3061\u306E \u3042\u308B \u304B\u304A",
      pellets: P([
        ...withColor(RING, "lemon"),
        ...withColor([[-1, -1], [-1, 0]], "purple"),
        ...withColor([[1, -1], [1, 0]], "red")
      ])
    },
    {
      id: "rainbow",
      name: "\u306B\u3058\u3044\u308D",
      hint: "6\u3057\u3087\u304F\u3092 \u305C\u3093\u3076 \u3064\u304B\u3046",
      pellets: P([
        ...withColor([[-2, -1], [-2, 0], [-2, 1]], "red"),
        ...withColor([[-1, -2], [-1, -1], [-1, 0], [-1, 1]], "lemon"),
        ...withColor([[0, -2], [0, -1], [0, 0], [0, 1], [0, 2]], "green"),
        ...withColor([[1, -2], [1, -1], [1, 0], [1, 1]], "blue"),
        ...withColor([[2, -1], [2, 0], [2, 1]], "purple")
      ])
    }
  ];

  // src/player/player.js
  var player_exports = {};
  __export(player_exports, {
    buildFinale: () => buildFinale,
    cancel: () => cancel,
    getEngine: () => getEngine,
    isOpen: () => isOpen,
    launchShell: () => launchShell,
    playShow: () => playShow
  });

  // src/fireworks-engine/palette.js
  var list = [];
  var map = /* @__PURE__ */ new Map();
  function colorIndex(css) {
    let i = map.get(css);
    if (i === void 0) {
      i = list.length;
      list.push(css);
      map.set(css, i);
    }
    return i;
  }
  function colorAt(index) {
    return list[index] || "#ffffff";
  }
  for (const c of PELLET_COLORS) {
    for (const p of c.particles) colorIndex(p);
  }
  var WHITE = colorIndex("#ffffff");
  var EMBER = colorIndex("#ffd9a0");
  var EMBER_HOT = colorIndex("#fff3d0");

  // src/fireworks-engine/particles.js
  var GRAVITY = 0.1;
  var DRAG = 3;
  var TAIL_STEP = 55e-4;
  var ALPHA_BUCKETS = 6;
  var SIZE_BUCKETS = 4;
  var SIZE_LW = [0.9, 1.5, 2.3, 3.4];
  var BUCKETS_PER_COLOR = ALPHA_BUCKETS * SIZE_BUCKETS;
  var ParticleSystem = class {
    constructor(capacity = 26e3) {
      this.cap = capacity;
      this.count = 0;
      const f = () => new Float32Array(capacity);
      this.x = f();
      this.y = f();
      this.px = f();
      this.py = f();
      this.vx = f();
      this.vy = f();
      this.age = f();
      this.life = f();
      this.size = f();
      this.bright = f();
      this.twinkle = f();
      this.phase = f();
      this.freq = f();
      this.gmul = f();
      this.dmul = f();
      this.ci = new Uint16Array(capacity);
      this.flags = new Uint8Array(capacity);
      this.buckets = [];
      this.usedKeys = [];
      this.emitTrail = null;
    }
    reset() {
      this.count = 0;
    }
    get freeSlots() {
      return this.cap - this.count;
    }
    /**
     * 1 粒追加
     * @param {number} x @param {number} y
     * @param {number} vx @param {number} vy
     * @param {object} o  { life, size, ci, bright, twinkle, gmul, dmul, trail }
     */
    spawn(x, y, vx, vy, o) {
      if (this.count >= this.cap) return -1;
      const i = this.count++;
      this.x[i] = x;
      this.y[i] = y;
      this.px[i] = x;
      this.py[i] = y;
      this.vx[i] = vx;
      this.vy[i] = vy;
      this.age[i] = 0;
      this.life[i] = o.life;
      this.size[i] = o.size;
      this.bright[i] = o.bright ?? 1;
      this.twinkle[i] = o.twinkle ?? 0;
      this.phase[i] = Math.random() * 6.283;
      this.freq[i] = 14 + Math.random() * 26;
      this.gmul[i] = o.gmul ?? 1;
      this.dmul[i] = o.dmul ?? 1;
      this.ci[i] = o.ci;
      this.flags[i] = (o.trail ? 1 : 0) | (o.tail ? 2 : 0) | (o.hold ? 4 : 0);
      return i;
    }
    _kill(i) {
      const last = --this.count;
      if (i !== last) {
        this.x[i] = this.x[last];
        this.y[i] = this.y[last];
        this.px[i] = this.px[last];
        this.py[i] = this.py[last];
        this.vx[i] = this.vx[last];
        this.vy[i] = this.vy[last];
        this.age[i] = this.age[last];
        this.life[i] = this.life[last];
        this.size[i] = this.size[last];
        this.bright[i] = this.bright[last];
        this.twinkle[i] = this.twinkle[last];
        this.phase[i] = this.phase[last];
        this.freq[i] = this.freq[last];
        this.gmul[i] = this.gmul[last];
        this.dmul[i] = this.dmul[last];
        this.ci[i] = this.ci[last];
        this.flags[i] = this.flags[last];
      }
    }
    /**
     * 物理更新
     * @param {number} dt 秒
     * @param {(x:number,y:number,ci:number)=>void} [onTrail] 錦の火の粉を出す
     * @param {(x:number,y:number,ci:number,size:number)=>void} [onTail] 割物の引き（尾）を出す
     */
    update(dt, onTrail, onTail) {
      const { x, y, px, py, vx, vy, age, life, gmul, dmul, flags, ci } = this;
      const gdt = GRAVITY * dt;
      for (let i = 0; i < this.count; i++) {
        const a = age[i] += dt;
        if (a >= life[i]) {
          this._kill(i);
          i--;
          continue;
        }
        const d = Math.exp(-DRAG * dmul[i] * dt);
        vx[i] *= d;
        vy[i] *= d;
        vy[i] += gdt * gmul[i];
        px[i] = x[i];
        py[i] = y[i];
        x[i] += vx[i] * dt;
        y[i] += vy[i] * dt;
        if (y[i] > 1.25) {
          this._kill(i);
          i--;
          continue;
        }
        const fl = flags[i];
        if (fl & 1 && onTrail && Math.random() < dt * 14) {
          onTrail(x[i], y[i], ci[i]);
        }
        if (fl & 2 && onTail) {
          const dist = Math.hypot(x[i] - px[i], y[i] - py[i]);
          if (dist > 15e-4) {
            const n = Math.min(5, Math.ceil(dist / TAIL_STEP));
            for (let k = 0; k < n; k++) {
              const f = (k + Math.random()) / n;
              onTail(px[i] + (x[i] - px[i]) * f, py[i] + (y[i] - py[i]) * f, ci[i], dist / dt);
            }
          }
        }
      }
    }
    /** いま生きている粒の明るさ（0..1） */
    _alpha(i) {
      const t = this.age[i] / this.life[i];
      let a = this.flags[i] & 4 ? t < 0.82 ? 1 - t * 0.25 : (1 - t) / 0.18 * 0.8 : Math.pow(1 - t, 1.15);
      a *= 1 + 0.4 * Math.exp(-this.age[i] * 11);
      const tw = this.twinkle[i];
      if (tw > 0) {
        const s = Math.sin(this.phase[i] + this.age[i] * this.freq[i]);
        a *= 1 - tw + tw * (0.45 + 0.55 * s * s);
      }
      a *= this.bright[i];
      return a > 1 ? 1 : a;
    }
    /**
     * 描画
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} ox ステージ左上 X（デバイスpx）
     * @param {number} oy ステージ左上 Y（デバイスpx）
     * @param {number} unit ステージ高さ（デバイスpx）
     */
    draw(ctx2, ox, oy, unit) {
      const { buckets, usedKeys } = this;
      usedKeys.length = 0;
      for (let i = 0; i < this.count; i++) {
        const a = this._alpha(i);
        if (a < 0.035) continue;
        let ab = a * ALPHA_BUCKETS | 0;
        if (ab >= ALPHA_BUCKETS) ab = ALPHA_BUCKETS - 1;
        const s = this.size[i];
        const sb = s < 1.2 ? 0 : s < 1.9 ? 1 : s < 2.8 ? 2 : 3;
        const key = this.ci[i] * BUCKETS_PER_COLOR + ab * SIZE_BUCKETS + sb;
        let arr = buckets[key];
        if (arr === void 0) {
          arr = buckets[key] = [];
        }
        if (arr.length === 0) usedKeys.push(key);
        arr.push(i);
      }
      const lwScale = unit / 1e3;
      ctx2.lineCap = "round";
      ctx2.lineJoin = "round";
      for (let k = 0; k < usedKeys.length; k++) {
        const key = usedKeys[k];
        const arr = buckets[key];
        const sb = key % SIZE_BUCKETS;
        const ab = (key / SIZE_BUCKETS | 0) % ALPHA_BUCKETS;
        const cidx = key / BUCKETS_PER_COLOR | 0;
        const alpha = (ab + 1) / ALPHA_BUCKETS;
        const lw = Math.max(0.6, SIZE_LW[sb] * lwScale);
        const path = new Path2D();
        for (let j = 0; j < arr.length; j++) {
          const i = arr[j];
          path.moveTo(ox + this.px[i] * unit, oy + this.py[i] * unit);
          path.lineTo(ox + this.x[i] * unit, oy + this.y[i] * unit);
        }
        ctx2.strokeStyle = colorAt(cidx);
        if (alpha > 0.32) {
          ctx2.globalAlpha = alpha * 0.085;
          ctx2.lineWidth = lw * 2.9;
          ctx2.stroke(path);
        }
        ctx2.globalAlpha = alpha;
        ctx2.lineWidth = lw;
        ctx2.stroke(path);
        arr.length = 0;
      }
      ctx2.globalAlpha = 1;
    }
  };

  // src/fireworks-engine/sky.js
  var STAR_SEED = 20250922;
  function drawSky(ctx2, w, h, stage) {
    ctx2.setTransform(1, 0, 0, 1, 0, 0);
    ctx2.clearRect(0, 0, w, h);
    const g = ctx2.createLinearGradient(0, stage.y, 0, stage.y + stage.h);
    g.addColorStop(0, "#04060f");
    g.addColorStop(0.45, "#081127");
    g.addColorStop(0.78, "#0d1c3c");
    g.addColorStop(1, "#152a4e");
    ctx2.fillStyle = "#02030a";
    ctx2.fillRect(0, 0, w, h);
    ctx2.fillStyle = g;
    ctx2.fillRect(stage.x, stage.y, stage.w, stage.h);
    const rand = mulberry32(STAR_SEED);
    const unit = stage.h;
    ctx2.save();
    ctx2.globalCompositeOperation = "lighter";
    for (let i = 0; i < 14; i++) {
      const cx = stage.x + rand() * stage.w;
      const cy = stage.y + rand() * stage.h * 0.75;
      const r = unit * (0.1 + rand() * 0.25);
      const rg = ctx2.createRadialGradient(cx, cy, 0, cx, cy, r);
      rg.addColorStop(0, "rgba(90,120,190,0.07)");
      rg.addColorStop(1, "rgba(90,120,190,0)");
      ctx2.fillStyle = rg;
      ctx2.beginPath();
      ctx2.arc(cx, cy, r, 0, Math.PI * 2);
      ctx2.fill();
    }
    const starCount = Math.round(260 * (stage.w / unit / 1.777));
    for (let i = 0; i < starCount; i++) {
      const sx = stage.x + rand() * stage.w;
      const sy = stage.y + rand() * stage.h * 0.94;
      const depth = rand();
      const r = (0.4 + depth * 1.5) * (unit / 1e3);
      const a = 0.18 + depth * 0.65 * (1 - (sy - stage.y) / stage.h) * 1.1;
      ctx2.fillStyle = `rgba(${210 + (rand() * 45 | 0)},${225 + (rand() * 30 | 0)},255,${a.toFixed(3)})`;
      ctx2.beginPath();
      ctx2.arc(sx, sy, r, 0, Math.PI * 2);
      ctx2.fill();
      if (depth > 0.92) {
        const rg = ctx2.createRadialGradient(sx, sy, 0, sx, sy, r * 7);
        rg.addColorStop(0, "rgba(200,220,255,0.28)");
        rg.addColorStop(1, "rgba(200,220,255,0)");
        ctx2.fillStyle = rg;
        ctx2.beginPath();
        ctx2.arc(sx, sy, r * 7, 0, Math.PI * 2);
        ctx2.fill();
      }
    }
    ctx2.restore();
    drawGround(ctx2, stage, rand);
    if (stage.x > 0 || stage.y > 0) {
      ctx2.fillStyle = "#010206";
      if (stage.x > 0) {
        ctx2.fillRect(0, 0, stage.x, h);
        ctx2.fillRect(stage.x + stage.w, 0, w - stage.x - stage.w, h);
      }
      if (stage.y > 0) {
        ctx2.fillRect(0, 0, w, stage.y);
        ctx2.fillRect(0, stage.y + stage.h, w, h - stage.y - stage.h);
      }
    }
  }
  function drawGround(ctx2, stage, rand) {
    const baseY = stage.y + stage.h;
    const unit = stage.h;
    const horizon = baseY - unit * 0.085;
    const hg = ctx2.createLinearGradient(0, horizon - unit * 0.18, 0, horizon + unit * 0.02);
    hg.addColorStop(0, "rgba(60,110,190,0)");
    hg.addColorStop(1, "rgba(90,150,220,0.16)");
    ctx2.fillStyle = hg;
    ctx2.fillRect(stage.x, horizon - unit * 0.18, stage.w, unit * 0.2);
    ctx2.fillStyle = "#060a17";
    ctx2.beginPath();
    ctx2.moveTo(stage.x, baseY);
    const steps = 26;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = stage.x + t * stage.w;
      const wobble = Math.sin(t * 7.3 + 1.2) * 0.012 + Math.sin(t * 17.1) * 5e-3 + rand() * 2e-3;
      ctx2.lineTo(px, horizon + wobble * unit);
    }
    ctx2.lineTo(stage.x + stage.w, baseY);
    ctx2.closePath();
    ctx2.fill();
    ctx2.fillStyle = "#03050d";
    ctx2.fillRect(stage.x, baseY - unit * 0.035, stage.w, unit * 0.035);
    ctx2.save();
    ctx2.globalCompositeOperation = "lighter";
    const lights = Math.round(48 * (stage.w / unit / 1.777));
    for (let i = 0; i < lights; i++) {
      const lx = stage.x + rand() * stage.w;
      const ly = horizon + rand() * unit * 0.05;
      const r = unit * 16e-4 * (0.6 + rand());
      ctx2.fillStyle = rand() < 0.3 ? "rgba(255,205,130,0.75)" : "rgba(180,215,255,0.5)";
      ctx2.beginPath();
      ctx2.arc(lx, ly, r, 0, Math.PI * 2);
      ctx2.fill();
    }
    ctx2.restore();
  }
  var STAGE_ASPECT = 16 / 9;
  function computeStage(w, h, aspect = STAGE_ASPECT) {
    let sw = w;
    let sh = w / aspect;
    if (sh > h) {
      sh = h;
      sw = h * aspect;
    }
    return { x: (w - sw) / 2, y: (h - sh) / 2, w: sw, h: sh };
  }

  // src/fireworks-engine/audio.js
  var ctx = null;
  var master = null;
  var noiseBuf = null;
  var enabled = true;
  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    const len = Math.floor(ctx.sampleRate * 1.6);
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return ctx;
  }
  function setSoundEnabled(v) {
    enabled = !!v;
    if (enabled) resume();
  }
  function resume() {
    const c = ensure();
    if (c && c.state === "suspended") c.resume();
  }
  function noiseSource(playbackRate = 1) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.playbackRate.value = playbackRate;
    return src;
  }
  function playLaunch(volume = 1) {
    if (!enabled) return;
    const c = ensure();
    if (!c) return;
    const t = c.currentTime;
    const src = noiseSource(1);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 6;
    bp.frequency.setValueAtTime(600, t);
    bp.frequency.exponentialRampToValueAtTime(2100, t + 0.75);
    const g = c.createGain();
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(0.09 * volume, t + 0.12);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.85);
    src.connect(bp).connect(g).connect(master);
    src.start(t);
    src.stop(t + 0.9);
  }
  function playBurst(scale = 1, crackle = false, volume = 1) {
    if (!enabled) return;
    const c = ensure();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150 / scale, t);
    osc.frequency.exponentialRampToValueAtTime(38 / scale, t + 0.35);
    const og = c.createGain();
    og.gain.setValueAtTime(1e-4, t);
    og.gain.exponentialRampToValueAtTime(0.5 * volume, t + 0.012);
    og.gain.exponentialRampToValueAtTime(1e-4, t + 0.7);
    osc.connect(og).connect(master);
    osc.start(t);
    osc.stop(t + 0.75);
    const src = noiseSource(1);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(2600, t);
    lp.frequency.exponentialRampToValueAtTime(320, t + 0.5);
    const g = c.createGain();
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(0.34 * volume, t + 0.01);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.6);
    src.connect(lp).connect(g).connect(master);
    src.start(t);
    src.stop(t + 0.65);
    if (crackle) {
      const cs = noiseSource(1.6);
      const hp = c.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 2600;
      const cg = c.createGain();
      cg.gain.setValueAtTime(1e-4, t + 0.05);
      cg.gain.exponentialRampToValueAtTime(0.1 * volume, t + 0.18);
      cg.gain.exponentialRampToValueAtTime(1e-4, t + 1.4);
      cs.connect(hp).connect(cg).connect(master);
      cs.start(t + 0.05);
      cs.stop(t + 1.5);
    }
  }

  // src/fireworks-engine/engine.js
  var MAX_DPR = 2;
  var MAX_FRAME_DT = 0.25;
  var SUB_STEP = 1 / 30;
  var BURST_RADIUS = 0.34;
  var PARTICLES_PER_PELLET = 10;
  var PELLET_SPREAD = 0.03;
  var STAR_DRAG_MUL = 0.8;
  var STAR_LIFE = 2.3;
  var TAU = Math.PI * 2;
  var FireworksEngine = class {
    /**
     * @param {HTMLElement} container キャンバスを入れる親要素
     */
    constructor(container, opts = {}) {
      /** 尾を引く火花がこぼす火の粉 */
      __publicField(this, "_trailEmitter", (x, y, ci) => {
        const ps = this.particles;
        if (ps.freeSlots < 500) return;
        ps.spawn(x, y, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, {
          life: 0.22 + Math.random() * 0.3,
          size: 0.9 + Math.random() * 0.6,
          ci,
          bright: 0.75,
          twinkle: 0.7,
          gmul: 0.5,
          dmul: 2.2
        });
      });
      /** 割物の星が飛びながら曳く尾（引き）。その場に残って短く燃える */
      __publicField(this, "_tailEmitter", (x, y, ci, speed) => {
        const ps = this.particles;
        if (ps.freeSlots < 300) return;
        const k = Math.min(1, speed / (BURST_RADIUS * DRAG * STAR_DRAG_MUL));
        ps.spawn(x, y, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, {
          life: 0.16 + 0.34 * k + Math.random() * 0.12,
          size: 1 + 0.9 * k,
          ci,
          bright: 0.35 + 0.5 * k,
          twinkle: 0.25,
          gmul: 0.35,
          dmul: 2
        });
      });
      this.container = container;
      this.opts = { maxParticles: 26e3, ...opts };
      this.bgCanvas = document.createElement("canvas");
      this.bgCanvas.className = "fw-layer fw-layer-bg";
      this.fxCanvas = document.createElement("canvas");
      this.fxCanvas.className = "fw-layer fw-layer-fx";
      container.append(this.bgCanvas, this.fxCanvas);
      this.bg = this.bgCanvas.getContext("2d");
      this.fx = this.fxCanvas.getContext("2d");
      this.particles = new ParticleSystem(this.opts.maxParticles);
      this.shells = [];
      this.flashes = [];
      this.pending = [];
      this.time = 0;
      this.running = false;
      this.rafId = 0;
      this.lastTs = 0;
      this.idleSince = -1;
      this.onIdle = null;
      this.onProgress = null;
      this.duration = 0;
      this.quality = 1;
      this._frameAcc = 0;
      this._frameCount = 0;
      this.fps = 60;
      this.dpr = 1;
      this.stage = { x: 0, y: 0, w: 1, h: 1 };
      this._onResize = () => this.resize();
      this._ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(this._onResize) : null;
      this._ro?.observe(container);
      window.addEventListener("resize", this._onResize);
      this.resize();
    }
    destroy() {
      this.stop();
      this._ro?.disconnect();
      window.removeEventListener("resize", this._onResize);
      this.bgCanvas.remove();
      this.fxCanvas.remove();
    }
    /* --------------------------------------------------------------- 画面 */
    resize() {
      const rect = this.container.getBoundingClientRect();
      const cssW = Math.max(1, Math.round(rect.width));
      const cssH = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      this.dpr = dpr;
      const w = Math.round(cssW * dpr);
      const h = Math.round(cssH * dpr);
      for (const cv of [this.bgCanvas, this.fxCanvas]) {
        if (cv.width !== w || cv.height !== h) {
          cv.width = w;
          cv.height = h;
        }
        cv.style.width = cssW + "px";
        cv.style.height = cssH + "px";
      }
      this.stage = computeStage(w, h, STAGE_ASPECT);
      drawSky(this.bg, w, h, this.stage);
      this.fx.setTransform(1, 0, 0, 1, 0, 0);
      this.fx.clearRect(0, 0, w, h);
    }
    /* ----------------------------------------------------------- 再生制御 */
    start() {
      if (this.running) return;
      this.running = true;
      this.lastTs = 0;
      const loop = (ts) => {
        if (!this.running) return;
        this.rafId = requestAnimationFrame(loop);
        if (!this.lastTs) {
          this.lastTs = ts;
          return;
        }
        let dt = (ts - this.lastTs) / 1e3;
        this.lastTs = ts;
        if (dt > MAX_FRAME_DT) dt = MAX_FRAME_DT;
        this._tick(dt);
      };
      this.rafId = requestAnimationFrame(loop);
    }
    stop() {
      this.running = false;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    clear() {
      this.particles.reset();
      this.shells.length = 0;
      this.flashes.length = 0;
      this.pending.length = 0;
      this.time = 0;
      this.duration = 0;
      this.fx.setTransform(1, 0, 0, 1, 0, 0);
      this.fx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);
    }
    /**
     * 設計した玉を 1 発打ち上げる
     * @param {import('../types/shell.js').FireworkShell} shell
     * @param {{x?:number,y?:number,onEnd?:Function}} [opts]
     */
    launch(shell, opts = {}) {
      return this.playShots([{ shell, x: opts.x, y: opts.y, delay: 0 }], opts);
    }
    /**
     * 複数発（上映・フィナーレ用）。頭から再生する。
     * @param {Shot[]} shots
     */
    playShots(shots, opts = {}) {
      this.clear();
      this.schedule(shots, 0);
      const last = shots.length ? Math.max(...shots.map((s) => s.delay || 0)) : 0;
      this.duration = last + (opts.tail ?? 4.4);
      this.onIdle = opts.onEnd || null;
      this.start();
      return this.duration;
    }
    /** 現在時刻 + offset で予約する */
    schedule(shots, offset = 0) {
      for (const shot of shots) {
        this.pending.push({ time: this.time + offset + (shot.delay || 0), shot });
      }
      this.pending.sort((a, b) => a.time - b.time);
      const last = this.pending.length ? this.pending[this.pending.length - 1].time : this.time;
      this.duration = Math.max(this.duration, last + 4.4);
      this.start();
    }
    isBusy() {
      return this.pending.length > 0 || this.shells.length > 0 || this.flashes.length > 0 || this.particles.count > 0;
    }
    /* ------------------------------------------------------------ 内部処理 */
    _tick(dt) {
      this._frameAcc += dt;
      this._frameCount++;
      if (this._frameAcc >= 0.5) {
        this.fps = this._frameCount / this._frameAcc;
        this._frameAcc = 0;
        this._frameCount = 0;
        if (this.fps < 42 && this.quality > 0.45) this.quality = Math.max(0.45, this.quality - 0.1);
        else if (this.fps > 56 && this.quality < 1) this.quality = Math.min(1, this.quality + 0.05);
      }
      let remain = dt;
      while (remain > 1e-4) {
        const step = Math.min(SUB_STEP, remain);
        remain -= step;
        this._step(step);
      }
      this._render(dt);
      if (this.onProgress) this.onProgress(this.time, this.duration);
      if (!this.isBusy()) {
        if (this.idleSince < 0) this.idleSince = this.time;
        const idleFor = this.time - this.idleSince;
        if (idleFor > 0.4 && this.onIdle) {
          const cb = this.onIdle;
          this.onIdle = null;
          cb();
        }
        if (idleFor > 1.2) this.stop();
      } else {
        this.idleSince = -1;
      }
    }
    /** 物理 1 ステップ */
    _step(dt) {
      this.time += dt;
      while (this.pending.length && this.pending[0].time <= this.time) {
        this._launchShot(this.pending.shift().shot);
      }
      this._updateShells(dt);
      this.particles.update(dt, this._trailEmitter, this._tailEmitter);
      this._updateFlashes(dt);
    }
    /* ------------------------------------------------- 打ち上げ（上昇） */
    _launchShot(shot) {
      const nx = shot.x ?? 0.5;
      const ny = shot.y ?? 0.34;
      const ux = nx * STAGE_ASPECT;
      const dist = Math.max(0.12, 1 - ny);
      const rising = {
        shot,
        x0: ux + (Math.random() - 0.5) * 0.03,
        y0: 1.02,
        tx: ux,
        ty: ny,
        t: 0,
        dur: 0.55 + dist * 0.9,
        wob: (Math.random() - 0.5) * 0.02,
        x: ux + (Math.random() - 0.5) * 0.03,
        y: 1.02,
        trailAcc: 0
      };
      this.shells.push(rising);
      playLaunch(0.7);
    }
    _updateShells(dt) {
      const ps = this.particles;
      for (let i = 0; i < this.shells.length; i++) {
        const s = this.shells[i];
        s.t += dt;
        const p = Math.min(1, s.t / s.dur);
        const pe = 1 - Math.pow(1 - p, 2.2);
        const prevX = s.x;
        const prevY = s.y;
        s.x = s.x0 + (s.tx - s.x0) * pe + s.wob * Math.sin(p * Math.PI);
        s.y = s.y0 + (s.ty - s.y0) * pe;
        s.trailAcc += dt;
        const step = 0.01;
        while (s.trailAcc > step) {
          s.trailAcc -= step;
          const k = Math.min(1, Math.max(0, s.trailAcc / dt));
          const bx = s.x + (prevX - s.x) * k;
          const by = s.y + (prevY - s.y) * k;
          ps.spawn(
            bx + (Math.random() - 0.5) * 4e-3,
            by + Math.random() * 4e-3,
            (Math.random() - 0.5) * 0.02,
            0.02 + Math.random() * 0.05,
            {
              life: 0.28 + Math.random() * 0.4,
              size: 1 + Math.random() * 1,
              ci: Math.random() < 0.3 ? EMBER_HOT : EMBER,
              bright: 0.55 + Math.random() * 0.35,
              twinkle: 0.35,
              gmul: 0.25,
              dmul: 1.6
            }
          );
        }
        ps.spawn(s.x, s.y, 0, 0, {
          life: 0.1,
          size: 3,
          ci: EMBER_HOT,
          bright: 1.3,
          twinkle: 0,
          gmul: 0,
          dmul: 3
        });
        if (p >= 1) {
          this._burst(s);
          this.shells.splice(i, 1);
          i--;
        }
      }
    }
    /* --------------------------------------------------------------- 開花 */
    /**
     * 割物の開き方で、玉の中の星の配置をそのまま空へ拡大して開かせる。
     *   星の中心 (x,y)[cm] / 2.5cm  ->  -1..1 の方向ベクトル
     *   その方向へ「開花半径 R」ぶん飛ぶ初速 v0 = R × 実効DRAG を与える
     * 強い割薬で全部の星が同時に・同じ速さで押し出され、尾を曳きながら R まで飛んで止まる。
     * 玉の中の並びが R 倍に拡大された「形」として空に残り、最後に揃って消える。
     */
    _burst(rising) {
      const ps = this.particles;
      const rand = Math.random;
      const shell = rising.shot.shell;
      const pellets = shell?.pellets || [];
      const R = BURST_RADIUS;
      const starDrag = DRAG * STAR_DRAG_MUL;
      const v0 = R * starDrag;
      const cmToUnit = 1 / MAX_PELLET_CENTER_R_CM;
      const life = STAR_LIFE + rand() * 0.2;
      let per = Math.max(3, Math.round(PARTICLES_PER_PELLET * this.quality));
      if (pellets.length) per = Math.min(per, Math.floor(Math.max(120, ps.freeSlots - 6e3) / pellets.length));
      for (const pel of pellets) {
        const color = getPelletColor(pel.color);
        const palette = color.particles;
        const dirX = pel.x * cmToUnit;
        const dirY = pel.y * cmToUnit;
        const glow = color.glow ?? 1;
        const core = colorIndex(palette[0]);
        const light = colorIndex(palette[Math.min(2, palette.length - 1)]);
        ps.spawn(rising.x, rising.y, dirX * v0, dirY * v0, {
          life: life + rand() * 0.05,
          size: 3.6,
          ci: core,
          bright: 1.35 * glow,
          twinkle: color.twinkle * 0.5,
          gmul: 0.8,
          dmul: STAR_DRAG_MUL,
          tail: true,
          hold: true
        });
        ps.spawn(rising.x, rising.y, dirX * v0, dirY * v0, {
          life: life + rand() * 0.05,
          size: 2.4,
          ci: light,
          bright: 1 * glow,
          twinkle: color.twinkle,
          gmul: 0.8,
          dmul: STAR_DRAG_MUL,
          hold: true
        });
        for (let i = 0; i < per; i++) {
          const a = rand() * TAU;
          const rr = Math.sqrt(rand()) * PELLET_SPREAD;
          const speed = v0 * (0.985 + rand() * 0.03);
          ps.spawn(
            rising.x,
            rising.y,
            (dirX + Math.cos(a) * rr) * speed,
            (dirY + Math.sin(a) * rr) * speed,
            {
              life: life * (0.9 + rand() * 0.1),
              size: 1.6 + rand() * 1,
              ci: colorIndex(palette[rand() * palette.length | 0]),
              bright: 1 * glow,
              twinkle: color.twinkle + 0.1,
              gmul: 0.8,
              dmul: STAR_DRAG_MUL,
              hold: true
            }
          );
        }
      }
      if (ps.freeSlots > 400) {
        const n = Math.round(60 * this.quality);
        for (let i = 0; i < n; i++) {
          const th = rand() * TAU;
          const sp = R * 0.55 * DRAG * (0.6 + rand() * 0.6);
          ps.spawn(rising.x, rising.y, Math.cos(th) * sp, Math.sin(th) * sp, {
            life: 0.14 + rand() * 0.14,
            size: 1.4 + rand() * 0.8,
            ci: rand() < 0.6 ? WHITE : EMBER_HOT,
            bright: 0.9,
            twinkle: 0.2,
            gmul: 0.4,
            dmul: 1.4
          });
        }
      }
      this.flashes.push({
        x: rising.x,
        y: rising.y,
        r: R * 1.1,
        t: 0,
        dur: 0.3
      });
      playBurst(1.15, pellets.length > 12, 0.9);
    }
    _updateFlashes(dt) {
      for (let i = 0; i < this.flashes.length; i++) {
        const f = this.flashes[i];
        f.t += dt;
        if (f.t >= f.dur) {
          this.flashes.splice(i, 1);
          i--;
        }
      }
    }
    /* --------------------------------------------------------------- 描画 */
    _render(dt) {
      const ctx2 = this.fx;
      const { x: ox, y: oy, h: unit } = this.stage;
      const w = this.fxCanvas.width;
      const h = this.fxCanvas.height;
      ctx2.setTransform(1, 0, 0, 1, 0, 0);
      ctx2.globalCompositeOperation = "destination-out";
      ctx2.globalAlpha = 1;
      ctx2.fillStyle = `rgba(0,0,0,${(1 - Math.exp(-dt * 9)).toFixed(4)})`;
      ctx2.fillRect(0, 0, w, h);
      ctx2.globalCompositeOperation = "lighter";
      for (const f of this.flashes) {
        const p = f.t / f.dur;
        const a = Math.pow(1 - p, 2.6);
        const cx = ox + f.x * unit;
        const cy = oy + f.y * unit;
        const r = f.r * unit * (0.35 + p * 0.9);
        const g = ctx2.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(255,252,240,${(a * 0.7).toFixed(3)})`);
        g.addColorStop(0.3, `rgba(255,240,205,${(a * 0.18).toFixed(3)})`);
        g.addColorStop(1, "rgba(255,230,180,0)");
        ctx2.fillStyle = g;
        ctx2.beginPath();
        ctx2.arc(cx, cy, r, 0, Math.PI * 2);
        ctx2.fill();
      }
      ctx2.globalAlpha = 1;
      this.particles.draw(ctx2, ox, oy, unit);
      ctx2.globalCompositeOperation = "source-over";
      ctx2.globalAlpha = 1;
    }
  };

  // src/player/player.js
  var overlay = null;
  var stageEl = null;
  var titleEl = null;
  var subEl = null;
  var barEl = null;
  var hintEl = null;
  var engine = null;
  var token = null;
  function build() {
    if (overlay) return;
    overlay = el("div.player-overlay", { hidden: true });
    stageEl = el("div.player-stage");
    titleEl = el("div.player-title");
    subEl = el("div.player-sub");
    barEl = el("div.player-bar-fill");
    hintEl = el("div.player-hint", {}, ["ESC / \u3068\u3058\u308B \u3067\u3082\u3069\u308B"]);
    const closeBtn = el("button.player-close", {
      type: "button",
      title: "\u3068\u3058\u308B (ESC)",
      html: uiIcon("close") + "<span>\u3068\u3058\u308B</span>",
      onClick: () => cancel()
    });
    overlay.append(
      stageEl,
      el("div.player-caption", {}, [titleEl, subEl]),
      el("div.player-bar", {}, [barEl]),
      hintEl,
      closeBtn
    );
    (qs("#player-root") || document.body).append(overlay);
    document.addEventListener("keydown", (e) => {
      if (!overlay.hidden && e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    });
  }
  function ensureEngine() {
    build();
    if (!engine) engine = new FireworksEngine(stageEl);
    return engine;
  }
  var wait = (ms, tk) => new Promise((res) => {
    const id = setTimeout(res, ms);
    if (tk) tk.timers.push(() => {
      clearTimeout(id);
      res();
    });
  });
  async function openOverlay(fullscreen) {
    build();
    overlay.hidden = false;
    overlay.classList.add("is-open");
    document.body.classList.add("is-playing");
    if (barEl) barEl.style.width = "0%";
    resume();
    if (fullscreen && !document.fullscreenElement) {
      try {
        await overlay.requestFullscreen({ navigationUI: "hide" });
      } catch {
      }
    }
    const eng = ensureEngine();
    await new Promise((r) => setTimeout(r, 40));
    eng.resize();
    eng.onProgress = (t, d) => {
      if (barEl) barEl.style.width = Math.min(100, d > 0 ? t / d * 100 : 0) + "%";
    };
    return eng;
  }
  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("is-playing");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {
    });
    setTimeout(() => {
      if (!overlay.classList.contains("is-open")) {
        overlay.hidden = true;
        engine?.clear();
        engine?.stop();
      }
    }, 220);
  }
  function cancel() {
    if (token) {
      token.cancelled = true;
      for (const fn of token.timers.splice(0)) fn();
      token.abort?.();
      token = null;
    }
    engine?.clear();
    closeOverlay();
  }
  function cancelSilently() {
    if (token) {
      token.cancelled = true;
      for (const fn of token.timers.splice(0)) fn();
      token.abort?.();
      token = null;
    }
    engine?.clear();
  }
  function isOpen() {
    return !!overlay && !overlay.hidden;
  }
  function setCaption(main, sub = "") {
    if (!titleEl) return;
    titleEl.textContent = main || "";
    subEl.textContent = sub || "";
    titleEl.parentElement.classList.toggle("is-visible", !!main);
  }
  function runShots(shots, tk) {
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(guard);
        resolve();
      };
      const eng = engine;
      const last = shots.length ? Math.max(...shots.map((s) => s.delay || 0)) : 0;
      const guard = setTimeout(finish, (last + 5) * 1e3 + 3e3);
      tk.timers.push(() => {
        clearTimeout(guard);
        finish();
      });
      tk.abort = () => {
        eng.clear();
        finish();
      };
      eng.playShots(shots, { onEnd: finish });
    });
  }
  async function launchShell(shell, opts = {}) {
    cancelSilently();
    const tk = { cancelled: false, timers: [] };
    token = tk;
    await openOverlay(!!opts.fullscreen);
    if (tk.cancelled) return;
    hintEl.textContent = "ESC / \u3068\u3058\u308B \u3067\u3082\u3069\u308B";
    if (opts.title) {
      setCaption(opts.title, `\u307B\u3057 ${shell.pellets.length}\u3053 \u306E 2.5\u53F7\u7389`);
      await wait(1100, tk);
      setCaption("");
    } else {
      setCaption("");
    }
    if (tk.cancelled) return;
    await runShots([{ shell, x: 0.5, y: 0.34, delay: 0 }], tk);
    if (tk.cancelled) return;
    await wait(500, tk);
    if (tk.cancelled) return;
    token = null;
    closeOverlay();
    opts.onDone?.();
  }
  async function playShow(entries, opts = {}) {
    cancelSilently();
    const tk = { cancelled: false, timers: [] };
    token = tk;
    await openOverlay(opts.fullscreen !== false);
    if (tk.cancelled) return;
    hintEl.textContent = "ESC / \u3068\u3058\u308B \u3067\u4E0A\u6620\u3092\u3084\u3081\u308B";
    setCaption("\u307F\u3093\u306A\u306E\u82B1\u706B\u5927\u4F1A", entries.length + " \u306F\u3064");
    await wait(2200, tk);
    setCaption("");
    await wait(300, tk);
    for (let i = 0; i < entries.length; i++) {
      if (tk.cancelled) return;
      const entry = entries[i];
      setCaption(entry.name, `${i + 1} / ${entries.length}`);
      await wait(1500, tk);
      if (tk.cancelled) return;
      setCaption("");
      await runShots([{ shell: entry.shell, x: 0.5, y: 0.33, delay: 0 }], tk);
      if (tk.cancelled) return;
      await wait(600, tk);
    }
    if (tk.cancelled) return;
    const finale = buildFinale(entries.map((e) => e.shell));
    if (finale.length) {
      setCaption("\u30D5\u30A3\u30CA\u30FC\u30EC", "\u307F\u3093\u306A\u306E\u82B1\u706B\u304C \u3044\u3063\u3057\u3087\u306B");
      await wait(1800, tk);
      setCaption("");
      await runShots(finale, tk);
      if (tk.cancelled) return;
    }
    setCaption("\u304A\u3057\u307E\u3044", "\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F");
    await wait(2600, tk);
    token = null;
    closeOverlay();
    opts.onDone?.();
  }
  function buildFinale(shells, { waveGap = 0.5, maxShots = 30 } = {}) {
    const usable = shells.filter((s) => s && s.pellets && s.pellets.length);
    if (!usable.length) return [];
    const xs = [0.2, 0.5, 0.8, 0.34, 0.66];
    const ys = [0.3, 0.24, 0.3, 0.42, 0.42];
    const shots = [];
    let i = 0;
    const rounds = Math.max(1, Math.ceil(Math.min(maxShots, usable.length * 2) / usable.length));
    for (let r = 0; r < rounds; r++) {
      for (const shell of usable) {
        if (shots.length >= maxShots) break;
        shots.push({
          shell,
          x: xs[i % xs.length],
          y: ys[i % ys.length],
          delay: Math.round(Math.floor(i / 2) * waveGap * 10) / 10
        });
        i++;
      }
    }
    const last = shots.length ? Math.max(...shots.map((s) => s.delay)) : 0;
    const grand = last + 1.4;
    [0.18, 0.36, 0.5, 0.64, 0.82].forEach((x, k) => {
      shots.push({
        shell: usable[k % usable.length],
        x,
        y: k === 2 ? 0.24 : 0.33,
        delay: grand
      });
    });
    return shots;
  }
  function getEngine() {
    return engine;
  }

  // src/scan/analyze.js
  var RECT_SIZE = 360;
  var HOUGH_MAX = 260;
  var PELLET_RATIO = PELLET_RADIUS_CM / SHELL_RADIUS_CM;
  function detectOutline(img) {
    const small = grayScaled(img, HOUGH_MAX);
    const cands = houghCircle(small);
    if (!cands.length) return fallbackOutline(img);
    const k = 1 / small.scale;
    let best = null;
    for (const c of cands) {
      const o = refineOutline(img, c.cx * k, c.cy * k, c.r * k);
      const support = outlineSupport(img, o);
      if (!best || support > best.support + 0.02 || support > best.support - 0.02 && outlineRadius(o) > outlineRadius(best.o)) {
        best = { o, support };
      }
    }
    if (!best || best.support < 0.25) return fallbackOutline(img);
    return { ...best.o, found: best.support >= 0.55 };
  }
  function circleOutline(cx, cy, r) {
    return { cx, cy, m: [r, 0, 0, r], found: true, method: "manual" };
  }
  function outlineRadius(o) {
    return Math.sqrt(Math.abs(o.m[0] * o.m[3] - o.m[1] * o.m[2]));
  }
  function fallbackOutline(img) {
    const r = Math.min(img.width, img.height) * 0.38;
    return { ...circleOutline(img.width / 2, img.height / 2, r), found: false, method: "fallback" };
  }
  function grayScaled(img, maxSide) {
    const s = Math.min(1, maxSide / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * s));
    const h = Math.max(1, Math.round(img.height * s));
    const g = new Float32Array(w * h);
    const n = new Float32Array(w * h);
    const d = img.data;
    for (let y = 0; y < img.height; y++) {
      const ty = Math.min(h - 1, Math.floor(y * s));
      for (let x = 0; x < img.width; x++) {
        const tx = Math.min(w - 1, Math.floor(x * s));
        const i = (y * img.width + x) * 4;
        const t = ty * w + tx;
        g[t] += (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
        n[t]++;
      }
    }
    for (let i = 0; i < g.length; i++) g[i] /= n[i] || 1;
    return { w, h, g, scale: w / img.width };
  }
  function boxBlur(src, w, h) {
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0;
        let cnt = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= w) continue;
            sum += src[yy * w + xx];
            cnt++;
          }
        }
        out[y * w + x] = sum / cnt;
      }
    }
    return out;
  }
  function houghCircle({ w, h, g }) {
    const b = boxBlur(g, w, h);
    const edges = [];
    const mags = [];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const sx = b[i - w + 1] + 2 * b[i + 1] + b[i + w + 1] - (b[i - w - 1] + 2 * b[i - 1] + b[i + w - 1]);
        const sy = b[i + w - 1] + 2 * b[i + w] + b[i + w + 1] - (b[i - w - 1] + 2 * b[i - w] + b[i - w + 1]);
        const m = Math.hypot(sx, sy);
        mags.push(m);
        edges.push(x, y, sx, sy, m);
      }
    }
    const thr = Math.max(0.12, percentile(mags, 0.86));
    const pts = [];
    for (let i = 0; i < edges.length; i += 5) {
      const m = edges[i + 4];
      if (m >= thr) pts.push({ x: edges[i], y: edges[i + 1], dx: edges[i + 2] / m, dy: edges[i + 3] / m });
    }
    if (pts.length < 20) return [];
    const minSide = Math.min(w, h);
    const rMin = Math.max(8, Math.round(minSide * 0.08));
    const rMax = Math.max(rMin + 4, Math.round(minSide * 0.54));
    const acc = new Float32Array(w * h);
    for (const p of pts) {
      for (let r = rMin; r <= rMax; r++) {
        let x = Math.round(p.x + p.dx * r);
        let y = Math.round(p.y + p.dy * r);
        if (x >= 0 && x < w && y >= 0 && y < h) acc[y * w + x]++;
        x = Math.round(p.x - p.dx * r);
        y = Math.round(p.y - p.dy * r);
        if (x >= 0 && x < w && y >= 0 && y < h) acc[y * w + x]++;
      }
    }
    const accB = boxBlur(boxBlur(acc, w, h), w, h);
    const order = [];
    for (let i = 0; i < accB.length; i++) if (accB[i] > 0) order.push(i);
    order.sort((a, c) => accB[c] - accB[a]);
    const peaks = [];
    for (const i of order) {
      const x = i % w;
      const y = i / w | 0;
      if (peaks.some((q) => Math.hypot(q.x - x, q.y - y) < rMin)) continue;
      peaks.push({ x, y });
      if (peaks.length >= 6) break;
    }
    const cands = [];
    for (const pk of peaks) {
      for (const c of bestRadii(pts, pk.x, pk.y, rMin, rMax)) cands.push({ cx: pk.x, cy: pk.y, ...c });
    }
    cands.sort((a, c) => c.coverage - a.coverage);
    return cands.slice(0, 10);
  }
  function bestRadii(pts, cx, cy, rMin, rMax) {
    const BINS = 90;
    const rows = rMax + 5;
    const hits = new Uint8Array(rows * BINS);
    for (const p of pts) {
      const vx = p.x - cx;
      const vy = p.y - cy;
      const d = Math.hypot(vx, vy);
      if (d < rMin - 2 || d > rMax + 1) continue;
      if (Math.abs((vx * p.dx + vy * p.dy) / d) < 0.75) continue;
      const ri = Math.round(d);
      const bin = Math.floor((Math.atan2(vy, vx) + Math.PI) / (Math.PI * 2) * BINS) % BINS;
      hits[ri * BINS + bin] = 1;
    }
    const cov = new Float32Array(rows);
    for (let r = rMin; r <= rMax; r++) {
      let n = 0;
      for (let bin = 0; bin < BINS; bin++) {
        for (let dr = -3; dr <= 3; dr++) {
          if (hits[(r + dr) * BINS + bin]) {
            n++;
            break;
          }
        }
      }
      cov[r] = n / BINS;
    }
    const out = [];
    for (let r = rMin; r <= rMax; r++) {
      if (cov[r] < cov[r - 1] || cov[r] < cov[r + 1]) continue;
      if (out.some((o) => Math.abs(o.r - r) < 6)) continue;
      out.push({ r, coverage: cov[r] });
    }
    out.sort((a, b) => b.coverage - a.coverage);
    return out.slice(0, 3);
  }
  function refineOutline(img, cx, cy, r) {
    const circle = { cx, cy, m: [r, 0, 0, r], method: "circle" };
    let cur = circle;
    let ok = false;
    const WINDOWS = [
      [0.78, 1.3],
      [0.9, 1.1],
      [0.94, 1.06]
    ];
    for (const win of WINDOWS) {
      const pts = traceRays(img, cur, win);
      const fit = pts.length >= RAYS * 0.35 ? robustEllipse(pts) : null;
      if (!fit || !plausible(fit, cx, cy, r)) break;
      cur = { ...fit, method: "ellipse" };
      ok = true;
    }
    return ok ? cur : circle;
  }
  var RAYS = 144;
  function outlineSupport(img, o) {
    const pts = traceRays(img, o, [0.94, 1.06]);
    const inv = invert2(o.m);
    let n = 0;
    for (const p of pts) {
      const ux = inv[0] * (p.x - o.cx) + inv[1] * (p.y - o.cy);
      const uy = inv[2] * (p.x - o.cx) + inv[3] * (p.y - o.cy);
      if (Math.abs(Math.hypot(ux, uy) - 1) < 0.03) n++;
    }
    return n / RAYS;
  }
  function traceRays(img, o, [w0, w1]) {
    const pts = [];
    for (let k = 0; k < RAYS; k++) {
      const a = k / RAYS * Math.PI * 2;
      const ex = o.m[0] * Math.cos(a) + o.m[1] * Math.sin(a);
      const ey = o.m[2] * Math.cos(a) + o.m[3] * Math.sin(a);
      const tp = Math.hypot(ex, ey);
      const dx = ex / tp;
      const dy = ey / tp;
      const ts = [];
      const vs = [];
      let lo = Infinity;
      let hi = -Infinity;
      for (let t = tp * w0; t <= tp * w1; t += 0.5) {
        const v = maxChannel(img, o.cx + dx * t, o.cy + dy * t);
        if (v < 0) continue;
        ts.push(t);
        vs.push(v);
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      if (hi - lo < 0.18 || lo > hi * 0.75) continue;
      const cut = lo + (hi - lo) * 0.35;
      let best = null;
      let runStart = -1;
      for (let i = 0; i <= vs.length; i++) {
        const dark = i < vs.length && vs[i] <= cut;
        if (dark && runStart < 0) runStart = i;
        if (!dark && runStart >= 0) {
          const tc = (ts[runStart] + ts[i - 1]) / 2;
          if (!best || Math.abs(tc - tp) < Math.abs(best - tp)) best = tc;
          runStart = -1;
        }
      }
      if (best != null) pts.push({ x: o.cx + dx * best, y: o.cy + dy * best });
    }
    return pts;
  }
  function robustEllipse(pts) {
    let inliers = pts;
    let fit = null;
    for (let round = 0; round < 3; round++) {
      const next = fitEllipse(inliers);
      if (!next) break;
      fit = next;
      const inv = invert2(fit.m);
      const kept = inliers.filter((p) => {
        const ux = inv[0] * (p.x - fit.cx) + inv[1] * (p.y - fit.cy);
        const uy = inv[2] * (p.x - fit.cx) + inv[3] * (p.y - fit.cy);
        return Math.abs(Math.hypot(ux, uy) - 1) < 0.035;
      });
      if (kept.length < RAYS * 0.3) break;
      inliers = kept;
    }
    return fit;
  }
  function plausible(fit, cx, cy, r) {
    const { major, minor } = axes(fit.m);
    const mean = Math.sqrt(major * minor);
    return major / minor <= 1.6 && mean > r * 0.7 && mean < r * 1.4 && Math.hypot(fit.cx - cx, fit.cy - cy) < r * 0.3;
  }
  function maxChannel(img, x, y) {
    const xi = Math.round(x);
    const yi = Math.round(y);
    if (xi < 0 || yi < 0 || xi >= img.width || yi >= img.height) return -1;
    const i = (yi * img.width + xi) * 4;
    const d = img.data;
    return Math.max(d[i], d[i + 1], d[i + 2]) / 255;
  }
  function fitEllipse(pts) {
    if (pts.length < 6) return null;
    let mx = 0;
    let my = 0;
    for (const p of pts) {
      mx += p.x;
      my += p.y;
    }
    mx /= pts.length;
    my /= pts.length;
    let rms = 0;
    for (const p of pts) rms += (p.x - mx) ** 2 + (p.y - my) ** 2;
    const s = 1 / Math.sqrt(rms / pts.length || 1);
    const N = Array.from({ length: 5 }, () => new Float64Array(6));
    for (const p of pts) {
      const x = (p.x - mx) * s;
      const y = (p.y - my) * s;
      const row = [x * x, x * y, y * y, x, y];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) N[i][j] += row[i] * row[j];
        N[i][5] += row[i];
      }
    }
    const sol = solve(N);
    if (!sol) return null;
    const [a, b, c, d, e] = sol;
    const det = 4 * a * c - b * b;
    if (det <= 1e-12) return null;
    const x0 = (b * e - 2 * c * d) / det;
    const y0 = (b * d - 2 * a * e) / det;
    const f0 = a * x0 * x0 + b * x0 * y0 + c * y0 * y0 + d * x0 + e * y0 - 1;
    if (f0 >= 0) return null;
    const M = [a / -f0, b / 2 / -f0, b / 2 / -f0, c / -f0];
    if (M[0] <= 0 || M[0] * M[3] - M[1] * M[2] <= 0) return null;
    const A = sqrtSym(invert2(M));
    return {
      cx: x0 / s + mx,
      cy: y0 / s + my,
      m: A.map((v) => v / s)
    };
  }
  function solve(N) {
    const n = N.length;
    for (let col = 0; col < n; col++) {
      let piv = col;
      for (let r = col + 1; r < n; r++) if (Math.abs(N[r][col]) > Math.abs(N[piv][col])) piv = r;
      if (Math.abs(N[piv][col]) < 1e-12) return null;
      [N[col], N[piv]] = [N[piv], N[col]];
      for (let r = 0; r < n; r++) {
        if (r === col) continue;
        const f = N[r][col] / N[col][col];
        for (let k = col; k <= n; k++) N[r][k] -= f * N[col][k];
      }
    }
    return N.map((row, i) => row[n] / row[i]);
  }
  function invert2([a, b, c, d]) {
    const det = a * d - b * c;
    return [d / det, -b / det, -c / det, a / det];
  }
  function sqrtSym([a, b, , d]) {
    const sd = Math.sqrt(a * d - b * b);
    const t = Math.sqrt(a + d + 2 * sd);
    return [(a + sd) / t, b / t, b / t, (d + sd) / t];
  }
  function axes(m) {
    const p = m[0] * m[0] + m[1] * m[1];
    const q = m[0] * m[2] + m[1] * m[3];
    const r = m[2] * m[2] + m[3] * m[3];
    const tr = (p + r) / 2;
    const disc = Math.sqrt(Math.max(0, tr * tr - (p * r - q * q)));
    return { major: Math.sqrt(tr + disc), minor: Math.sqrt(Math.max(1e-9, tr - disc)) };
  }
  function percentile(arr, q) {
    if (!arr.length) return 0;
    const a = Float32Array.from(arr).sort();
    return a[Math.min(a.length - 1, Math.floor(q * (a.length - 1)))];
  }
  function rectify(img, outline, size = RECT_SIZE) {
    const out = new Uint8ClampedArray(size * size * 4);
    const [m00, m01, m10, m11] = outline.m;
    const d = img.data;
    const W = img.width;
    const H = img.height;
    for (let j = 0; j < size; j++) {
      const uy = (j + 0.5) / size * 2 - 1;
      for (let i = 0; i < size; i++) {
        const ux = (i + 0.5) / size * 2 - 1;
        if (ux * ux + uy * uy > 1) continue;
        const sx = outline.cx + m00 * ux + m01 * uy;
        const sy = outline.cy + m10 * ux + m11 * uy;
        const x0 = Math.floor(sx);
        const y0 = Math.floor(sy);
        if (x0 < 0 || y0 < 0 || x0 >= W - 1 || y0 >= H - 1) continue;
        const fx = sx - x0;
        const fy = sy - y0;
        const o = (j * size + i) * 4;
        const i00 = (y0 * W + x0) * 4;
        const i10 = i00 + 4;
        const i01 = i00 + W * 4;
        const i11 = i01 + 4;
        for (let ch = 0; ch < 3; ch++) {
          const top = d[i00 + ch] * (1 - fx) + d[i10 + ch] * fx;
          const bot = d[i01 + ch] * (1 - fx) + d[i11 + ch] * fx;
          out[o + ch] = top * (1 - fy) + bot * fy;
        }
        out[o + 3] = 255;
      }
    }
    return { width: size, height: size, data: out };
  }
  function estimatePaper(rect) {
    const { width: n, data: d } = rect;
    const lums = [];
    for (let i = 0; i < d.length; i += 12) if (d[i + 3]) lums.push(d[i] + d[i + 1] + d[i + 2]);
    const bright = percentile(lums, 0.8);
    const A = [new Float64Array(3), new Float64Array(3), new Float64Array(3)];
    const B = [new Float64Array(3), new Float64Array(3), new Float64Array(3)];
    let count = 0;
    for (let j = 0; j < n; j += 3) {
      for (let i = 0; i < n; i += 3) {
        const o = (j * n + i) * 4;
        if (!d[o + 3]) continue;
        const r = d[o];
        const g = d[o + 1];
        const b = d[o + 2];
        const mx = Math.max(r, g, b);
        if (r + g + b < bright * 0.82 || mx - Math.min(r, g, b) > mx * 0.22) continue;
        const x = i / n * 2 - 1;
        const y = j / n * 2 - 1;
        const row = [1, x, y];
        for (let p = 0; p < 3; p++) {
          for (let q = 0; q < 3; q++) A[p][q] += row[p] * row[q];
          B[0][p] += row[p] * r;
          B[1][p] += row[p] * g;
          B[2][p] += row[p] * b;
        }
        count++;
      }
    }
    if (count < 60) {
      const flat = Math.max(60, bright / 3);
      return () => [flat, flat, flat];
    }
    const coef = [0, 1, 2].map(
      (ch) => solve([
        [...A[0], B[ch][0]],
        [...A[1], B[ch][1]],
        [...A[2], B[ch][2]]
      ]) || [bright / 3, 0, 0]
    );
    return (x, y) => coef.map((c) => Math.max(40, c[0] + c[1] * x + c[2] * y));
  }
  var PAPER = 0;
  var DARK = 1;
  function paletteHues() {
    const chroma = [];
    let white = null;
    let whiteSat = Infinity;
    for (const c of PELLET_COLORS) {
      const [r, g, b] = hexToRgb(c.swatch);
      const { h, s } = hsv(r, g, b);
      if (s < whiteSat) {
        whiteSat = s;
        white = c.id;
      }
      chroma.push({ id: c.id, h, s });
    }
    return { chroma: chroma.filter((c) => c.id !== white && c.s > 0.25), white };
  }
  function hexToRgb(hex) {
    const v = parseInt(hex.replace("#", ""), 16);
    return [v >> 16 & 255, v >> 8 & 255, v & 255];
  }
  function hsv(r, g, b) {
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const c = mx - mn;
    let h = 0;
    if (c > 0) {
      if (mx === r) h = (g - b) / c % 6;
      else if (mx === g) h = (b - r) / c + 2;
      else h = (r - g) / c + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h, s: mx ? c / mx : 0, v: mx, c };
  }
  function classify(rect) {
    const n = rect.width;
    const d = rect.data;
    const paper = estimatePaper(rect);
    const { chroma } = paletteHues();
    const map2 = new Uint8Array(n * n);
    for (let j = 0; j < n; j++) {
      const y = j / n * 2 - 1;
      for (let i = 0; i < n; i++) {
        const o = (j * n + i) * 4;
        if (!d[o + 3]) continue;
        const x = i / n * 2 - 1;
        const rho = Math.hypot(x, y);
        const [pr, pg, pb] = paper(x, y);
        const r = Math.min(1, d[o] / pr);
        const g = Math.min(1, d[o + 1] / pg);
        const b = Math.min(1, d[o + 2] / pb);
        const { h, v, c } = hsv(r, g, b);
        if (c > 0.2 && v > 0.2) {
          let best = 0;
          let bestD = Infinity;
          for (let k = 0; k < chroma.length; k++) {
            const dd = Math.min(Math.abs(h - chroma[k].h), 360 - Math.abs(h - chroma[k].h));
            if (dd < bestD) {
              bestD = dd;
              best = k;
            }
          }
          map2[j * n + i] = 2 + best;
        } else if (v < 0.62 && rho < 0.95) {
          map2[j * n + i] = DARK;
        }
      }
    }
    return { map: map2, size: n, chroma: chroma.map((c) => c.id) };
  }
  function ringOffsets(fracs, counts, pr) {
    const out = [];
    fracs.forEach((f, k) => {
      const cnt = counts[k];
      for (let i = 0; i < cnt; i++) {
        const a = i / cnt * Math.PI * 2 + k * 0.4;
        out.push(Math.round(Math.cos(a) * f * pr), Math.round(Math.sin(a) * f * pr));
      }
    });
    return Int16Array.from(out);
  }
  function detectPellets(cls) {
    const { map: map2, size: n, chroma } = cls;
    const { white } = paletteHues();
    const half = n / 2;
    const pr = half * PELLET_RATIO;
    const cmPerPx = SHELL_RADIUS_CM / half;
    const FILL = ringOffsets([0, 0.22, 0.44, 0.66, 0.86], [1, 6, 12, 16, 22], pr);
    const EDGE = ringOffsets([1.28], [24], pr);
    const INNER = ringOffsets([0, 0.25, 0.5, 0.68], [1, 6, 12, 16], pr);
    const RING_R = [0.78, 0.9, 1, 1.1];
    const RING_A = 36;
    const RING2 = [];
    for (let a = 0; a < RING_A; a++) {
      const ang = a / RING_A * Math.PI * 2;
      for (const f of RING_R) RING2.push(Math.round(Math.cos(ang) * f * pr), Math.round(Math.sin(ang) * f * pr));
    }
    const at = (x, y) => x < 0 || y < 0 || x >= n || y >= n ? PAPER : map2[y * n + x];
    const counts = new Int32Array(2 + chroma.length);
    const reach = (MAX_PELLET_CENTER_R_CM + 0.3) / cmPerPx;
    const cands = [];
    for (let cy = 0; cy < n; cy += 2) {
      for (let cx = 0; cx < n; cx += 2) {
        if (Math.hypot(cx - half, cy - half) > reach) continue;
        counts.fill(0);
        for (let k = 0; k < FILL.length; k += 2) counts[at(cx + FILL[k], cy + FILL[k + 1])]++;
        let cls2 = -1;
        let top = 0;
        for (let c = 2; c < counts.length; c++) {
          if (counts[c] > top) {
            top = counts[c];
            cls2 = c;
          }
        }
        let fillScore = 0;
        if (cls2 >= 0) {
          const fill = top / (FILL.length / 2);
          if (fill > 0.3) {
            let other = 0;
            for (let k = 0; k < EDGE.length; k += 2) if (at(cx + EDGE[k], cy + EDGE[k + 1]) !== cls2) other++;
            fillScore = fill * 0.75 + other / (EDGE.length / 2) * 0.25;
          }
        }
        let ringScore = 0;
        let hitAngles = 0;
        for (let a = 0; a < RING_A; a++) {
          const base = a * RING_R.length * 2;
          for (let f = 0; f < RING_R.length; f++) {
            if (at(cx + RING2[base + f * 2], cy + RING2[base + f * 2 + 1]) !== PAPER) {
              hitAngles++;
              break;
            }
          }
        }
        const ringFrac = hitAngles / RING_A;
        if (ringFrac > 0.5) {
          let paperIn = 0;
          for (let k = 0; k < INNER.length; k += 2) if (at(cx + INNER[k], cy + INNER[k + 1]) === PAPER) paperIn++;
          ringScore = ringFrac * (paperIn / (INNER.length / 2));
        }
        const score = Math.max(fillScore, ringScore);
        if (score >= 0.55) {
          cands.push({ cx, cy, score, mode: fillScore >= ringScore ? "fill" : "ring", cls: cls2 });
        }
      }
    }
    cands.sort((a, b) => b.score - a.score);
    const picked = [];
    const minD = pr * 1.5;
    for (const c of cands) {
      if (picked.some((p) => Math.hypot(p.cx - c.cx, p.cy - c.cy) < minD)) continue;
      picked.push(c);
      if (picked.length >= MAX_PELLETS + 6) break;
    }
    return picked.map((c) => {
      const { x: px, y: py } = refineCenter(map2, n, c, pr);
      let color;
      if (c.mode === "fill") color = chroma[c.cls - 2];
      else color = ringColor(map2, n, px, py, pr, chroma) || white;
      return {
        px,
        py,
        x: (px - half) * cmPerPx,
        y: (py - half) * cmPerPx,
        color,
        score: c.score,
        mode: c.mode
      };
    });
  }
  function refineCenter(map2, n, c, pr) {
    const R = Math.ceil(pr * (c.mode === "fill" ? 1 : 1.2));
    const ink = c.mode === "ring" ? dominantInk(map2, n, c.cx, c.cy, pr) : -1;
    let sx = 0;
    let sy = 0;
    let cnt = 0;
    for (let dy2 = -R; dy2 <= R; dy2++) {
      const y = c.cy + dy2;
      if (y < 0 || y >= n) continue;
      for (let dx2 = -R; dx2 <= R; dx2++) {
        const x = c.cx + dx2;
        if (x < 0 || x >= n) continue;
        const d = Math.hypot(dx2, dy2);
        if (d > R) continue;
        const v = map2[y * n + x];
        const ok = c.mode === "fill" ? v === c.cls : v === ink && d > pr * 0.65;
        if (!ok) continue;
        sx += x;
        sy += y;
        cnt++;
      }
    }
    if (!cnt) return { x: c.cx, y: c.cy };
    let dx = sx / cnt - c.cx;
    let dy = sy / cnt - c.cy;
    const lim = pr * 0.35;
    const len = Math.hypot(dx, dy);
    if (len > lim) {
      dx *= lim / len;
      dy *= lim / len;
    }
    return { x: c.cx + dx, y: c.cy + dy };
  }
  function dominantInk(map2, n, cx, cy, pr) {
    const counts = /* @__PURE__ */ new Map();
    const R = Math.ceil(pr * 1.05);
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        const d = Math.hypot(dx, dy);
        if (d < pr * 0.75 || d > pr * 1.05) continue;
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x >= n || y >= n) continue;
        const v = map2[y * n + x];
        if (v !== PAPER) counts.set(v, (counts.get(v) || 0) + 1);
      }
    }
    let best = DARK;
    let top = 0;
    for (const [v, cnt] of counts) {
      if (cnt > top) {
        top = cnt;
        best = v;
      }
    }
    return best;
  }
  function ringColor(map2, n, cx, cy, pr, chroma) {
    const counts = new Int32Array(2 + chroma.length);
    const R = Math.ceil(pr * 1);
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        const d = Math.hypot(dx, dy);
        if (d < pr * 0.75 || d > pr * 1) continue;
        const x = Math.round(cx + dx);
        const y = Math.round(cy + dy);
        if (x < 0 || y < 0 || x >= n || y >= n) continue;
        counts[map2[y * n + x]]++;
      }
    }
    let colored = 0;
    let best = -1;
    for (let c = 2; c < counts.length; c++) {
      colored += counts[c];
      if (best < 0 || counts[c] > counts[best]) best = c;
    }
    if (best < 0 || colored < counts[DARK] * 2) return null;
    return chroma[best - 2];
  }
  function analyzePhoto(img, { outline } = {}) {
    const o = outline || detectOutline(img);
    const rect = rectify(img, o);
    const cls = classify(rect);
    const pellets = detectPellets(cls);
    return { outline: o, rect, pellets };
  }
  function tidyPellets(raw, { rotation = 0, snapGrid = false } = {}) {
    const rad = rotation * Math.PI / 180;
    const cs = Math.cos(rad);
    const sn = Math.sin(rad);
    const pts = raw.slice().sort((a, b) => (b.score ?? 1) - (a.score ?? 1)).slice(0, MAX_PELLETS).map((p) => {
      const x = p.x * cs - p.y * sn;
      const y = p.x * sn + p.y * cs;
      return { x, y, ox: x, oy: y, color: p.color };
    });
    if (snapGrid) snapToSlots(pts);
    else relax(pts);
    const out = [];
    let moved = 0;
    let dropped = Math.max(0, raw.length - MAX_PELLETS);
    for (const p of pts) {
      let spot = canPlacePellet(p.x, p.y, out).ok ? { x: p.x, y: p.y } : null;
      if (!spot) spot = findNearbySpot(p.x, p.y, out, { maxDist: 1.2 });
      if (!spot) {
        dropped++;
        continue;
      }
      const pel = createPellet(spot.x, spot.y, p.color);
      out.push(pel);
      if (Math.hypot(pel.x - p.ox, pel.y - p.oy) > 0.08) moved++;
    }
    return { pellets: out, moved, dropped };
  }
  function clampInside(p) {
    const lim = MAX_PELLET_CENTER_R_CM - 2e-3;
    const r = Math.hypot(p.x, p.y);
    if (r > lim) {
      p.x *= lim / r;
      p.y *= lim / r;
    }
  }
  function relax(pts) {
    const need = MIN_PELLET_GAP_CM * 1.003;
    for (const p of pts) clampInside(p);
    for (let iter = 0; iter < 120; iter++) {
      let worst = 0;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          if (d >= need) continue;
          if (d < 1e-6) {
            const ang = (i * 2.399 + j) % (Math.PI * 2);
            dx = Math.cos(ang);
            dy = Math.sin(ang);
          } else {
            dx /= d;
            dy /= d;
          }
          const push = (need - d) / 2;
          a.x -= dx * push;
          a.y -= dy * push;
          b.x += dx * push;
          b.y += dy * push;
          worst = Math.max(worst, push);
        }
      }
      for (const p of pts) clampInside(p);
      if (worst < 1e-4) break;
    }
  }
  function snapToSlots(pts) {
    const slots = hexSlots();
    const pairs = [];
    pts.forEach((p, i) => slots.forEach((s, k) => pairs.push({ i, k, d: Math.hypot(p.x - s.x, p.y - s.y) })));
    pairs.sort((a, b) => a.d - b.d);
    const usedP = /* @__PURE__ */ new Set();
    const usedS = /* @__PURE__ */ new Set();
    for (const pr of pairs) {
      if (usedP.has(pr.i) || usedS.has(pr.k)) continue;
      usedP.add(pr.i);
      usedS.add(pr.k);
      pts[pr.i].x = slots[pr.k].x;
      pts[pr.i].y = slots[pr.k].y;
    }
    for (let i = 0; i < pts.length; i++) if (!usedP.has(i)) clampInside(pts[i]);
  }

  // src/scan/scan-dialog.js
  var PHOTO_MAX = 1e3;
  function openScanDialog() {
    const body = el("div.scan");
    const modal = openModal({ title: "\u3057\u3083\u3057\u3093\u304B\u3089 \u3064\u304F\u308B", wide: true, body });
    let photo = null;
    let result = null;
    let tidy = null;
    let rotation = 0;
    let snapGrid = false;
    showPick();
    function showPick() {
      clear(body);
      const fileBtn = (cls, icon, label, capture) => el(`label.btn.btn-big.file-btn.${cls}`, {}, [
        el("span", { html: uiIcon(icon) }),
        el("span", {}, [label]),
        el("input", {
          type: "file",
          accept: "image/*",
          capture: capture ? "environment" : null,
          onChange: (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) handleFile(f);
          }
        })
      ]);
      body.append(
        el("ol.scan-steps", {}, [
          el("li", {}, [
            el("b", {}, ["\u3061\u3087\u3063\u3051\u3044 6cm \u306E \u307E\u308B"]),
            "\u306E \u306A\u304B\u306B\u3001",
            el("b", {}, ["\u3061\u3087\u3063\u3051\u3044 1cm \u306E \u307E\u308B\uFF08\u307B\u3057\uFF09"]),
            "\u3092 \u3044\u308D\u30DA\u30F3\u3067 \u304B\u304F"
          ]),
          el("li", {}, ["\u307B\u3057\u306F \u306A\u304B\u307E\u3067 \u306C\u308A\u3064\u3076\u3059\u3002\u300C\u3057\u308D\u300D\u306E \u307B\u3057\u306F \u304F\u308D\u3044 \u305B\u3093\u3067 \u307E\u308B\u3060\u3051 \u304B\u304F"]),
          el("li", {}, ["\u3042\u304B\u308B\u3044 \u3068\u3053\u308D\u3067\u3001\u307E\u3046\u3048\u304B\u3089 \u307E\u308B \u305C\u3093\u305F\u3044\u304C \u3046\u3064\u308B\u3088\u3046\u306B \u3057\u3083\u3057\u3093\u3092 \u3068\u308B"])
        ]),
        el("div.scan-pick", {}, [
          fileBtn("btn-accent", "camera", "\u3057\u3083\u3057\u3093\u3092 \u3068\u308B", true),
          fileBtn("btn-soft", "gallery", "\u304C\u305E\u3046\u3092 \u3048\u3089\u3076", false)
        ]),
        el("div.scan-print", {}, [
          el("span", {}, ["6cm \u306E \u307E\u308B\u304C \u304B\u3044\u3066\u3042\u308B \u3088\u3046\u7D19\u304C \u306A\u3044\u3068\u304D\u306F \u2192 "]),
          el("button.btn.btn-ghost.btn-icon-text", {
            type: "button",
            html: uiIcon("print") + "<span>\u3088\u3046\u7D19\u3092 \u3044\u3093\u3055\u3064</span>",
            onClick: printWorksheet
          })
        ])
      );
    }
    modal.panel.addEventListener("dragover", (e) => e.preventDefault());
    modal.panel.addEventListener("drop", (e) => {
      e.preventDefault();
      const f = e.dataTransfer?.files?.[0];
      if (f) handleFile(f);
    });
    async function handleFile(file) {
      if (!file.type.startsWith("image/")) {
        showToast("\u304C\u305E\u3046\u306E \u30D5\u30A1\u30A4\u30EB\u3092 \u3048\u3089\u3093\u3067\u306D", "warn");
        return;
      }
      clear(body);
      body.append(el("div.scan-busy", {}, [el("span.scan-spinner"), "\u3088\u307F\u3068\u3063\u3066\u3044\u307E\u3059\u2026"]));
      try {
        photo = await loadPhoto(file);
      } catch {
        showToast("\u3053\u306E \u304C\u305E\u3046\u306F \u3088\u307F\u3053\u3081\u307E\u305B\u3093\u3067\u3057\u305F", "error");
        showPick();
        return;
      }
      await new Promise((r) => setTimeout(r, 30));
      rotation = 0;
      snapGrid = false;
      analyze();
      showResult();
    }
    function analyze(outline) {
      result = analyzePhoto(photo, { outline });
      retidy();
    }
    function retidy() {
      tidy = tidyPellets(result.pellets, { rotation, snapGrid });
    }
    function showResult() {
      clear(body);
      const photoCv = el("canvas.scan-photo");
      const previewCv = el("canvas.scan-preview");
      const summary = el("p.scan-summary");
      const r0 = outlineRadius(result.outline);
      const minSide = Math.min(photo.width, photo.height);
      const sizeInput = el("input.scan-range", {
        type: "range",
        min: String(Math.round(minSide * 0.08)),
        max: String(Math.round(Math.max(photo.width, photo.height) * 0.6)),
        step: "1",
        value: String(Math.round(r0)),
        "aria-label": "\u307E\u308B\u306E \u304A\u304A\u304D\u3055"
      });
      const snapBtn = el("button.btn.btn-soft.btn-icon-text.scan-toggle", {
        type: "button",
        html: uiIcon("grid") + "<span>\u3053\u3046\u3057\u306B \u305D\u308D\u3048\u308B</span>",
        onClick: () => {
          snapGrid = !snapGrid;
          retidy();
          paintAll();
        }
      });
      body.append(
        el("div.scan-result", {}, [
          el("div.scan-col", {}, [
            el("div.scan-label", {}, ["\u3057\u3083\u3057\u3093"]),
            el("div.scan-photo-wrap", {}, [photoCv]),
            el("div.scan-adjust", {}, [
              el("span.scan-adjust-label", {}, ["\u307E\u308B\u306E \u304A\u304A\u304D\u3055"]),
              sizeInput,
              el("button.btn.btn-ghost.btn-icon-text", {
                type: "button",
                title: "\u307E\u308B\u3092 \u3058\u3069\u3046\u3067 \u3055\u304C\u3057\u306A\u304A\u3059",
                html: uiIcon("reset") + "<span>\u3058\u3069\u3046</span>",
                onClick: () => {
                  analyze();
                  sizeInput.value = String(Math.round(outlineRadius(result.outline)));
                  paintAll();
                }
              })
            ]),
            el("p.scan-note", {}, ["\u307E\u308B\u304C \u305A\u308C\u3066\u3044\u305F\u3089\u3001\u3057\u3083\u3057\u3093\u3092 \u30C9\u30E9\u30C3\u30B0\u3057\u3066 \u3042\u308F\u305B\u3066\u306D"])
          ]),
          el("div.scan-col", {}, [
            el("div.scan-label", {}, ["\u3067\u304D\u3042\u304C\u308A"]),
            el("div.scan-preview-wrap", {}, [previewCv]),
            el("div.scan-adjust", {}, [
              el("button.btn.btn-soft.btn-icon-text", {
                type: "button",
                title: "\u3072\u3060\u308A\u306B \u307E\u308F\u3059",
                html: uiIcon("undo") + "<span>\u307E\u308F\u3059</span>",
                onClick: () => rotate(-90)
              }),
              el("button.btn.btn-soft.btn-icon-text", {
                type: "button",
                title: "\u307F\u304E\u306B \u307E\u308F\u3059",
                html: uiIcon("redo") + "<span>\u307E\u308F\u3059</span>",
                onClick: () => rotate(90)
              }),
              snapBtn
            ]),
            summary
          ])
        ]),
        el("div.scan-foot", {}, [
          el("button.btn.btn-ghost", {
            type: "button",
            html: uiIcon("camera") + "<span>\u3068\u308A\u306A\u304A\u3059</span>",
            onClick: showPick
          }),
          el("button.btn.btn-accent.btn-big", {
            type: "button",
            html: uiIcon("brush") + "<span>\u3053\u306E \u305F\u307E\u3092 \u3064\u304B\u3046</span>",
            onClick: apply
          })
        ])
      );
      function rotate(deg) {
        rotation = (rotation + deg + 360) % 360;
        retidy();
        paintAll();
      }
      let drag2 = null;
      photoCv.addEventListener("pointerdown", (e) => {
        const p = toPhoto(photoCv, e, photo.width);
        drag2 = { x: p.x, y: p.y, cx: result.outline.cx, cy: result.outline.cy };
        photoCv.setPointerCapture?.(e.pointerId);
        e.preventDefault();
      });
      photoCv.addEventListener("pointermove", (e) => {
        if (!drag2) return;
        const p = toPhoto(photoCv, e, photo.width);
        result.outline = adjustOutline(result.outline, { cx: drag2.cx + p.x - drag2.x, cy: drag2.cy + p.y - drag2.y });
        paintPhoto(photoCv, { showPellets: false });
      });
      const endDrag = () => {
        if (!drag2) return;
        drag2 = null;
        analyze(result.outline);
        paintAll();
      };
      photoCv.addEventListener("pointerup", endDrag);
      photoCv.addEventListener("pointercancel", endDrag);
      sizeInput.addEventListener("input", () => {
        result.outline = adjustOutline(result.outline, { r: Number(sizeInput.value) });
        paintPhoto(photoCv, { showPellets: false });
      });
      sizeInput.addEventListener("change", () => {
        analyze(result.outline);
        paintAll();
      });
      function paintAll() {
        paintPhoto(photoCv, { showPellets: true });
        paintPreview(previewCv);
        snapBtn.classList.toggle("is-on", snapGrid);
        summary.textContent = summaryText();
        summary.classList.toggle("is-warn", !result.outline.found || !tidy.pellets.length);
      }
      requestAnimationFrame(paintAll);
      setTimeout(paintAll, 60);
    }
    function summaryText() {
      if (!result.outline.found) {
        return "6cm \u306E \u307E\u308B\u304C \u3046\u307E\u304F \u307F\u3064\u304B\u3089\u306A\u304B\u3063\u305F\u3088\u3002\u3057\u3083\u3057\u3093\u3092 \u30C9\u30E9\u30C3\u30B0\u3057\u3066\u3001\u3042\u304A\u3044 \u307E\u308B\u3092 \u3042\u308F\u305B\u3066\u306D";
      }
      const n = tidy.pellets.length;
      if (!n) return "\u307B\u3057\u304C \u307F\u3064\u304B\u3089\u306A\u304B\u3063\u305F\u3088\u3002\u3044\u308D\u3092 \u3053\u304F \u306C\u3063\u3066\u3001\u3042\u304B\u308B\u3044 \u3068\u3053\u308D\u3067 \u3068\u308A\u306A\u304A\u3057\u3066\u307F\u3066\u306D";
      let t = `\u307B\u3057\u3092 ${n}\u3053 \u3088\u307F\u3068\u3063\u305F\u3088\u3002`;
      if (tidy.moved) t += `\u304B\u3055\u306A\u308A\u3084 \u306F\u307F\u3060\u3057\u3092 \u306A\u304A\u3059\u305F\u3081 ${tidy.moved}\u3053 \u3059\u3053\u3057 \u305A\u3089\u3057\u305F\u3088\u3002`;
      if (tidy.dropped) t += `${tidy.dropped}\u3053 \u306F \u306F\u3044\u308A\u304D\u3089\u306A\u304B\u3063\u305F\u3088\u3002`;
      return t + "\u3044\u308D\u3084 \u3070\u3057\u3087\u306F \u3064\u304F\u308B \u304C\u3081\u3093\u3067 \u306A\u304A\u305B\u308B\u3088";
    }
    function paintPhoto(cv, { showPellets }) {
      const { ctx: ctx2, w, h } = fitCanvas(cv, photo.width / photo.height, window.innerHeight * 0.5);
      const k = w / photo.width;
      ctx2.clearRect(0, 0, w, h);
      ctx2.drawImage(photo.canvas, 0, 0, w, h);
      const o = result.outline;
      const [m00, m01, m10, m11] = o.m;
      const unit = k * Math.sqrt(Math.abs(m00 * m11 - m01 * m10));
      const px = w / 400 * (window.devicePixelRatio > 1 ? 1.4 : 1);
      ctx2.save();
      ctx2.setTransform(k * m00, k * m10, k * m01, k * m11, k * o.cx, k * o.cy);
      ctx2.lineWidth = 3.5 * px / unit;
      ctx2.strokeStyle = o.found ? "rgba(47,138,74,0.95)" : "rgba(40,110,255,0.95)";
      ctx2.setLineDash(o.found ? [] : [12 / unit, 8 / unit]);
      ctx2.beginPath();
      ctx2.arc(0, 0, 1, 0, Math.PI * 2);
      ctx2.stroke();
      ctx2.setLineDash([]);
      if (showPellets) {
        const pr = PELLET_RADIUS_CM / SHELL_RADIUS_CM;
        const half = RECT_SIZE / 2;
        for (const p of result.pellets) {
          const ux = (p.px - half) / half;
          const uy = (p.py - half) / half;
          ctx2.beginPath();
          ctx2.arc(ux, uy, pr, 0, Math.PI * 2);
          ctx2.lineWidth = 5 * px / unit;
          ctx2.strokeStyle = "rgba(255,255,255,0.95)";
          ctx2.stroke();
          ctx2.lineWidth = 2.6 * px / unit;
          ctx2.strokeStyle = getPelletColor(p.color).swatch;
          ctx2.stroke();
        }
      }
      ctx2.restore();
    }
    function paintPreview(cv) {
      const { ctx: ctx2, w, h } = fitCanvas(cv, 1, window.innerHeight * 0.5);
      ctx2.fillStyle = "#0a1122";
      ctx2.fillRect(0, 0, w, h);
      drawShell(ctx2, { pellets: tidy.pellets }, w / 2, h / 2, Math.min(w, h) * 0.45, { showCase: true });
    }
    async function apply() {
      if (!tidy.pellets.length) {
        showToast("\u307B\u3057\u304C \u307F\u3064\u304B\u3063\u3066\u3044\u306A\u3044\u3088", "warn");
        return;
      }
      if (state.shell.pellets.length) {
        const ok = await confirmDialog({
          title: "\u3044\u307E\u306E \u305F\u307E\u3092 \u304A\u304D\u304B\u3048\u307E\u3059\u304B\uFF1F",
          message: "\u3057\u3083\u3057\u3093\u306E \u305F\u307E\u3092 \u3088\u307F\u3053\u3080\u3068 \u3044\u307E\u306E \u305F\u307E\u306F \u304D\u3048\u307E\u3059\uFF08\u307B\u305E\u3093\u3057\u3066 \u3044\u306A\u3051\u308C\u3070\uFF09",
          okLabel: "\u3088\u307F\u3053\u3080"
        });
        if (!ok) return;
      }
      setShell(
        createShell({ id: uid("shell"), name: "\u3057\u3083\u3057\u3093\u306E\u82B1\u706B", pellets: tidy.pellets }),
        { dirty: true }
      );
      modal.close();
      showToast(`\u3057\u3083\u3057\u3093\u304B\u3089 \u307B\u3057\u3092 ${tidy.pellets.length}\u3053 \u3088\u307F\u3053\u3093\u3060\u3088`, "success");
    }
  }
  async function loadPhoto(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const s = Math.min(1, PHOTO_MAX / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * s));
      const h = Math.max(1, Math.round(img.naturalHeight * s));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx2 = canvas.getContext("2d", { willReadFrequently: true });
      ctx2.drawImage(img, 0, 0, w, h);
      const { data } = ctx2.getImageData(0, 0, w, h);
      return { canvas, width: w, height: h, data };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  function fitCanvas(cv, aspect, maxCssH = Infinity) {
    const parentW = cv.parentElement?.clientWidth || 320;
    const cssW = Math.max(1, Math.min(parentW, maxCssH * aspect));
    cv.style.width = cssW + "px";
    cv.style.height = cssW / aspect + "px";
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(cssW * dpr));
    const h = Math.max(1, Math.round(w / aspect));
    if (cv.width !== w || cv.height !== h) {
      cv.width = w;
      cv.height = h;
    }
    const ctx2 = cv.getContext("2d");
    ctx2.setTransform(1, 0, 0, 1, 0, 0);
    return { ctx: ctx2, w, h };
  }
  function toPhoto(cv, e, photoWidth) {
    const rect = cv.getBoundingClientRect();
    const k = photoWidth / (rect.width || 1);
    return { x: (e.clientX - rect.left) * k, y: (e.clientY - rect.top) * k };
  }
  function adjustOutline(o, { cx = o.cx, cy = o.cy, r = outlineRadius(o) }) {
    const k = r / (outlineRadius(o) || 1);
    return { cx, cy, m: o.m.map((v) => v * k), found: true, method: "manual" };
  }
  function printWorksheet() {
    const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><title>\u30C7\u30B8\u30BF\u30EB\u82B1\u706B \u3088\u3046\u7D19</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #173f24; font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif; }
  .page { width: 210mm; height: 296mm; padding: 20mm 22mm 0; display: flex; flex-direction: column; align-items: center; }
  h1 { font-size: 19pt; margin: 0 0 3mm; letter-spacing: 0.05em; }
  .lead { font-size: 11pt; line-height: 1.8; margin: 0; text-align: center; }
  .name { margin-top: 9mm; width: 120mm; font-size: 12pt; border-bottom: 0.3mm solid #173f24; padding: 0 0 1.5mm 1mm; }
  .shell { margin-top: 18mm; }
  .note { margin-top: 14mm; font-size: 10pt; line-height: 1.8; color: #3d5a45; }
  .note li { margin: 0; }
  .sample { display: flex; align-items: center; gap: 4mm; font-size: 10pt; margin-top: 8mm; color: #3d5a45; }
</style></head>
<body><div class="page">
  <h1>\u30C7\u30B8\u30BF\u30EB\u82B1\u706B \u3088\u3046\u7D19\uFF082.5\u53F7\u7389\uFF09</h1>
  <p class="lead">\u307E\u308B\u306E \u306A\u304B\u306B\u3001\u3061\u3087\u3063\u3051\u3044 1cm \u306E \u307E\u308B\uFF08\u307B\u3057\uFF09\u3092 \u3044\u308D\u30DA\u30F3\u3067 \u304B\u3053\u3046\u3002<br>\u304B\u3044\u305F\u3089 \u30A2\u30D7\u30EA\u306E\u300C\u3057\u3083\u3057\u3093\u304B\u3089\u300D\u3067 \u3088\u307F\u3068\u308C\u308B\u3088\u3002</p>
  <div class="name">\u306A\u307E\u3048\uFF1A</div>
  <svg class="shell" width="80mm" height="80mm" viewBox="-40 -40 80 80" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="-34.5" font-size="4" text-anchor="middle" fill="#173f24">\u25B2 \u3046\u3048</text>
    <circle cx="0" cy="0" r="30" fill="none" stroke="#111" stroke-width="0.7"/>
  </svg>
  <div class="sample">
    <svg width="12mm" height="12mm" viewBox="-6 -6 12 12" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="5" fill="none" stroke="#9aa" stroke-width="0.3" stroke-dasharray="1 0.8"/>
    </svg>
    <span>\u2190 \u307B\u3057 1\u3053 \u306E \u304A\u304A\u304D\u3055\uFF08\u3061\u3087\u3063\u3051\u3044 1cm\uFF09</span>
  </div>
  <ul class="note">
    <li>\u307B\u3057\u306F \u306A\u304B\u307E\u3067 \u3057\u3063\u304B\u308A \u306C\u308A\u3064\u3076\u3059\uFF08\u3042\u304B\u30FB\u30EC\u30E2\u30F3\u30FB\u307F\u3069\u308A\u30FB\u3080\u3089\u3055\u304D\u30FB\u3042\u304A\uFF09</li>
    <li>\u300C\u3057\u308D\u300D\u306E \u307B\u3057\u306F\u3001\u304F\u308D\u3044 \u305B\u3093\u3067 \u307E\u308B\u3060\u3051 \u304B\u304F\uFF08\u306A\u304B\u306F \u306C\u3089\u306A\u3044\uFF09</li>
    <li>\u307B\u3057\u3069\u3046\u3057\u306F \u304B\u3055\u306D\u306A\u3044 \uFF0F 6cm \u306E \u307E\u308B\u304B\u3089 \u306F\u307F\u3060\u3055\u306A\u3044</li>
    <li>\u3057\u3083\u3057\u3093\u306F \u3042\u304B\u308B\u3044 \u3068\u3053\u308D\u3067\u3001\u307E\u3046\u3048\u304B\u3089 \u307E\u308B \u305C\u3093\u305F\u3044\u304C \u3046\u3064\u308B\u3088\u3046\u306B \u3068\u308B</li>
  </ul>
</div></body></html>`;
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    Object.assign(frame.style, { position: "fixed", right: "0", bottom: "0", width: "0", height: "0", border: "0" });
    frame.srcdoc = html;
    frame.addEventListener("load", () => {
      const win = frame.contentWindow;
      const cleanup = () => setTimeout(() => frame.remove(), 500);
      win.addEventListener("afterprint", cleanup);
      setTimeout(() => frame.isConnected && frame.remove(), 12e4);
      win.focus();
      win.print();
    });
    document.body.append(frame);
  }

  // src/shell-editor/shell-editor.js
  var view = null;
  var canvasEl = null;
  var hoverId = null;
  var conflictId = null;
  var ghost = null;
  var drag = null;
  var eraser = false;
  var onSavedCb = null;
  var syncTools = () => {
  };
  function render() {
    if (!view) return;
    view.render(state.shell, {
      selectedId: state.selectedPelletId,
      hoverId,
      conflictId,
      ghost,
      dragOrigin: drag && drag.moved ? drag.origin : null
    });
    syncMeta();
  }
  var fullCache = { sig: null, value: false };
  function shellIsFull() {
    const ps = state.shell.pellets;
    let sig = String(ps.length);
    for (const p of ps) sig += `|${p.x},${p.y}`;
    if (fullCache.sig !== sig) fullCache = { sig, value: isFull() };
    return fullCache.value;
  }
  function syncMeta() {
    const n = state.shell.pellets.length;
    const badge = qs("#pellet-count");
    if (badge) {
      const full = n > 0 && shellIsFull();
      badge.textContent = full ? `\u307B\u3057 ${n} \u3053\uFF08\u307E\u3093\u3071\u3044\uFF09` : `\u307B\u3057 ${n} \u3053`;
      badge.classList.toggle("is-full", full);
    }
    const nameInput = qs("#shell-name");
    if (nameInput && document.activeElement !== nameInput) {
      nameInput.value = state.shell.name;
    }
    const u = qs("#btn-undo");
    const r = qs("#btn-redo");
    if (u) u.disabled = !canUndo();
    if (r) r.disabled = !canRedo();
    const hint = qs("#shell-hint");
    if (hint) hint.hidden = n > 0;
  }
  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button === 2) return;
    const { x, y } = view.clientToCm(e.clientX, e.clientY);
    const hit = view.hitTest(x, y, state.shell);
    e.preventDefault();
    canvasEl.focus();
    if (!hit && Math.hypot(x, y) > SHELL_RADIUS_CM) {
      select(null);
      render();
      return;
    }
    if (eraser) {
      if (hit) {
        removePellet(hit.id);
        showToast("\u307B\u3057\u3092 \u3051\u3057\u305F\u3088", "info", 1200);
      }
      return;
    }
    if (hit) {
      select(hit.id);
      drag = {
        id: hit.id,
        origin: { x: hit.x, y: hit.y },
        offX: hit.x - x,
        offY: hit.y - y,
        moved: false,
        sx: x,
        sy: y,
        last: null,
        fresh: false
      };
      ghost = null;
      canvasEl.setPointerCapture?.(e.pointerId);
      render();
      return;
    }
    const res = addPellet(x, y);
    if (!res.ok) {
      flashError(res.reason);
      return;
    }
    const placed = res.pellet;
    drag = {
      id: placed.id,
      origin: { x: placed.x, y: placed.y },
      offX: 0,
      offY: 0,
      moved: false,
      sx: x,
      sy: y,
      last: null,
      fresh: true
    };
    ghost = null;
    canvasEl.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    if (!view) return;
    const { x, y } = view.clientToCm(e.clientX, e.clientY);
    if (drag) {
      if (!drag.moved && Math.hypot(x - drag.sx, y - drag.sy) < 0.12) return;
      drag.moved = true;
      const spot = previewSpot(x + drag.offX, y + drag.offY, drag.id);
      drag.last = spot;
      const t = testPosition(x + drag.offX, y + drag.offY, drag.id);
      conflictId = spot ? null : t.conflictId || null;
      ghost = {
        x: spot ? spot.x : t.x,
        y: spot ? spot.y : t.y,
        color: state.shell.pellets.find((p) => p.id === drag.id)?.color,
        valid: !!spot
      };
      render();
      return;
    }
    const hit = view.hitTest(x, y, state.shell);
    hoverId = hit ? hit.id : null;
    canvasEl.style.cursor = eraser ? "crosshair" : hit ? "grab" : "copy";
    if (hit || eraser || Math.hypot(x, y) > SHELL_RADIUS_CM) {
      ghost = null;
      conflictId = null;
    } else {
      const spot = previewSpot(x, y);
      const t = testPosition(x, y);
      conflictId = spot ? null : t.conflictId || null;
      ghost = {
        x: spot ? spot.x : x,
        y: spot ? spot.y : y,
        color: state.activeColor,
        valid: !!spot
      };
    }
    render();
  }
  function onPointerUp() {
    if (!drag) return;
    const d = drag;
    drag = null;
    ghost = null;
    conflictId = null;
    if (d.moved) {
      if (d.last) {
        const res = movePellet(d.id, d.last.x, d.last.y, { history: !d.fresh, snap: true });
        if (!res.ok) flashError(res.reason);
      } else {
        showToast("\u305D\u3053\u306B\u306F \u304A\u3051\u306A\u3044\u3088\u3002\u3082\u3068\u306E \u3070\u3057\u3087\u306B \u3082\u3069\u3057\u305F\u3088", "warn", 1800);
      }
    } else if (!d.fresh) {
      setPelletColor(d.id, state.activeColor);
    }
    render();
  }
  function onPointerLeave() {
    hoverId = null;
    if (!drag) {
      ghost = null;
      conflictId = null;
    }
    render();
  }
  function flashError(reason) {
    showToast(PLACE_ERROR_TEXT[reason] || "\u305D\u3053\u306B\u306F \u304A\u3051\u306A\u3044\u3088", "warn", 1500);
    const frame = qs("#shell-frame");
    if (frame) {
      frame.classList.remove("is-shake");
      void frame.offsetWidth;
      frame.classList.add("is-shake");
    }
  }
  function launch(fullscreen) {
    const shell = state.shell;
    if (!shell.pellets.length) {
      showToast("\u307B\u3057\u3092 \u304A\u3044\u3066\u304B\u3089 \u3046\u3061\u3042\u3052\u3066\u306D", "warn");
      return;
    }
    launchShell(cloneShell(shell), { fullscreen, title: shell.name });
  }
  async function saveShell2() {
    const shell = state.shell;
    if (!shell.pellets.length) {
      showToast("\u307B\u3057\u3092 \u304A\u3044\u3066\u304B\u3089 \u307B\u305E\u3093\u3057\u3066\u306D", "warn");
      return;
    }
    const name = await promptDialog({
      title: "\u306A\u307E\u3048\u3092 \u3064\u3051\u3066 \u307B\u305E\u3093",
      label: "\u306F\u306A\u3073\u306E \u306A\u307E\u3048",
      value: shell.name === "\u308F\u305F\u3057\u306E\u82B1\u706B" ? "" : shell.name,
      placeholder: "\u305F\u3068\u3048\u3070\u300C\u306A\u3064\u307E\u3064\u308A\u300D",
      okLabel: "\u307B\u305E\u3093\u3059\u308B"
    });
    if (name == null) return;
    const finalName = name.trim() || "\u306A\u307E\u3048\u306E\u306A\u3044\u82B1\u706B";
    if (finalName !== shell.name) setShellName(finalName);
    const thumb = renderShellThumbnail(state.shell, 256);
    const res = saveShell(state.shell, thumb);
    if (!res.ok) {
      showToast(res.error || "\u307B\u305E\u3093\u306B \u3057\u3063\u3071\u3044\u3057\u307E\u3057\u305F", "error");
      return;
    }
    markSaved();
    showToast("\u300C" + finalName + "\u300D\u3092 \u307B\u305E\u3093\u3057\u305F\u3088", "success");
    onSavedCb?.();
  }
  async function clearAll() {
    if (!state.shell.pellets.length) return;
    const ok = await confirmDialog({
      title: "\u307B\u3057\u3092 \u305C\u3093\u3076 \u3051\u3057\u307E\u3059\u304B\uFF1F",
      message: "\u304A\u3044\u305F \u307B\u3057\u304C \u305C\u3093\u3076 \u306A\u304F\u306A\u308A\u307E\u3059\uFF08\u300C\u3082\u3069\u3059\u300D\u3067 \u3075\u3063\u304B\u3064\u3067\u304D\u307E\u3059\uFF09",
      okLabel: "\u3051\u3059",
      danger: true
    });
    if (!ok) return;
    clearPellets();
    showToast("\u305C\u3093\u3076 \u3051\u3057\u307E\u3057\u305F\uFF08\u3082\u3069\u3059 \u3067 \u3075\u3063\u304B\u3064\uFF09", "info");
  }
  async function newShell2({ confirm = true } = {}) {
    const go = () => {
      newShell();
      showToast("\u3042\u305F\u3089\u3057\u3044 \u305F\u307E\u306B \u306A\u308A\u307E\u3057\u305F", "info");
    };
    if (!confirm || !state.shell.pellets.length) return go();
    const ok = await confirmDialog({
      title: "\u3042\u305F\u3089\u3057\u304F \u3064\u304F\u308A\u307E\u3059\u304B\uFF1F",
      message: "\u3044\u307E\u306E \u305F\u307E\u306F \u304D\u3048\u307E\u3059\uFF08\u307B\u305E\u3093\u3057\u3066 \u3044\u306A\u3051\u308C\u3070\uFF09",
      okLabel: "\u3042\u305F\u3089\u3057\u304F \u3064\u304F\u308B"
    });
    if (ok) go();
  }
  function openPresets() {
    const grid = el("div.tpl-grid");
    const m = openModal({ title: "\u304A\u3066\u307B\u3093\u3092 \u3048\u3089\u3076", wide: true, body: grid });
    for (const preset of SHELL_PRESETS) {
      const cv = el("canvas.tpl-canvas", { width: "132", height: "132" });
      const shell = createShell({ name: preset.name, pellets: preset.pellets });
      const ctx2 = cv.getContext("2d");
      ctx2.fillStyle = "#0a1122";
      ctx2.fillRect(0, 0, 132, 132);
      drawShell(ctx2, shell, 66, 66, 58, { showCase: true });
      grid.append(
        el(
          "button.tpl-card",
          {
            type: "button",
            onClick: async () => {
              m.close();
              if (state.shell.pellets.length) {
                const ok = await confirmDialog({
                  title: "\u3044\u307E\u306E \u305F\u307E\u3092 \u304A\u304D\u304B\u3048\u307E\u3059\u304B\uFF1F",
                  message: "\u304A\u3066\u307B\u3093\u3092 \u3088\u307F\u3053\u3080\u3068 \u3044\u307E\u306E \u305F\u307E\u306F \u304D\u3048\u307E\u3059",
                  okLabel: "\u3088\u307F\u3053\u3080"
                });
                if (!ok) return;
              }
              setShell(
                createShell({
                  id: uid("shell"),
                  name: preset.id === "blank" ? "\u308F\u305F\u3057\u306E\u82B1\u706B" : preset.name + "\u306E\u82B1\u706B",
                  pellets: preset.pellets
                })
              );
              showToast(`\u300C${preset.name}\u300D\u3092 \u3088\u307F\u3053\u3093\u3060\u3088`, "success");
            }
          },
          [
            cv,
            el("span.tpl-name", {}, [preset.name]),
            el("span.tpl-hint", {}, [preset.hint]),
            el("span.tpl-count", {}, [preset.pellets.length + " \u3053"])
          ]
        )
      );
    }
  }
  function mountShellEditor(rootEl, { onSaved } = {}) {
    onSavedCb = onSaved;
    canvasEl = qs("#shell-canvas", rootEl);
    view = new ShellCanvas(canvasEl);
    buildToolPanel(qs("#shell-tools", rootEl));
    buildActionBar(qs("#shell-actions", rootEl));
    canvasEl.addEventListener("pointerdown", onPointerDown);
    canvasEl.addEventListener("pointermove", onPointerMove);
    canvasEl.addEventListener("pointerup", onPointerUp);
    canvasEl.addEventListener("pointercancel", onPointerUp);
    canvasEl.addEventListener("pointerleave", onPointerLeave);
    canvasEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const { x, y } = view.clientToCm(e.clientX, e.clientY);
      const hit = view.hitTest(x, y, state.shell);
      if (hit) removePellet(hit.id);
    });
    const nameInput = qs("#shell-name", rootEl);
    nameInput.addEventListener("change", () => {
      const v = nameInput.value.trim() || "\u306A\u307E\u3048\u306E\u306A\u3044\u82B1\u706B";
      nameInput.value = v;
      setShellName(v);
    });
    const frame = qs("#shell-frame", rootEl);
    new ResizeObserver(() => {
      view.resize();
      render();
    }).observe(frame);
    on("change", render);
    on("select", render);
    on("view", render);
    on("history", syncMeta);
    on("reject", (r) => flashError(r.reason));
    render();
    return {
      render,
      refreshSize: () => {
        view.resize();
        render();
      },
      launch,
      saveShell: saveShell2
    };
  }
  function buildToolPanel(root3) {
    clear(root3);
    const colorWrap = el("div.color-grid");
    for (const c of PELLET_COLORS) {
      colorWrap.append(
        el(
          "button.color-btn",
          {
            type: "button",
            title: c.name,
            dataset: { color: c.id },
            // ここで決まるのは「つぎに おく ほし」の色。
            // すでに置いてある星は、その星をタップしたときだけ塗りかわる。
            onClick: () => {
              eraser = false;
              setTool({ activeColor: c.id });
              sync();
              render();
            }
          },
          [
            el("span.color-dot", { style: { background: c.swatch } }),
            el("span.color-label", {}, [c.name])
          ]
        )
      );
    }
    const eraserBtn = el("button.tool-wide", {
      type: "button",
      id: "btn-eraser",
      onClick: () => {
        eraser = !eraser;
        sync();
        render();
      },
      html: uiIcon("trash") + "<span>\u3051\u3057\u30B4\u30E0</span>"
    });
    root3.append(
      el("div.panel-section", {}, [
        el("div.step-badge.step-badge-panel", {}, [el("b", {}, ["1"]), el("span", {}, ["\u3044\u308D\u3092 \u3048\u3089\u3076"])]),
        colorWrap
      ]),
      el("div.panel-section.tool-row", {}, [
        eraserBtn,
        el("button.btn.btn-ghost.btn-block", {
          type: "button",
          onClick: openPresets,
          html: uiIcon("brush") + "<span>\u304A\u3066\u307B\u3093</span>"
        }),
        el("button.btn.btn-ghost.btn-block", {
          type: "button",
          title: "\u304B\u307F\u306B \u304B\u3044\u305F \u306F\u306A\u3073\u3060\u307E\u3092 \u3057\u3083\u3057\u3093\u3067 \u3088\u307F\u3068\u308B",
          onClick: openScanDialog,
          html: uiIcon("camera") + "<span>\u3057\u3083\u3057\u3093\u304B\u3089</span>"
        }),
        el("button.btn.btn-ghost.btn-block", {
          type: "button",
          html: uiIcon("grid") + "<span>\u305C\u3093\u3076 \u3046\u3081\u308B</span>",
          title: "\u3042\u3044\u3066\u3044\u308B \u3068\u3053\u308D\u3092 \u3044\u307E\u306E \u3044\u308D\u3067 \u3046\u3081\u308B",
          onClick: () => {
            const added = fillFreeSpots();
            if (added) showToast(`${added}\u3053 \u3075\u3084\u3057\u305F\u3088`, "success", 1400);
            else showToast("\u3082\u3046 \u3042\u3044\u3066\u308B \u3068\u3053\u308D\u304C \u306A\u3044\u3088", "warn", 1400);
          }
        }),
        el("button.btn.btn-ghost.btn-block", {
          type: "button",
          html: uiIcon("reset") + "<span>\u305C\u3093\u3076 \u3051\u3059</span>",
          onClick: clearAll
        })
      ]),
      el("div.panel-section.panel-section-compact", {}, [
        el("p.panel-note", {}, [
          "\u30BF\u30C3\u30D7\u3067 \u304A\u304F \uFF0F \u30C9\u30E9\u30C3\u30B0\u3067 \u3046\u3054\u304B\u3059 \uFF0F \u304A\u3044\u305F \u307B\u3057\u3092 \u30BF\u30C3\u30D7\u3059\u308B\u3068 \u3044\u307E\u306E \u3044\u308D\u306B \u304B\u308F\u308B\u3088\u3002"
        ])
      ])
    );
    function sync() {
      for (const b of colorWrap.children) {
        b.classList.toggle("is-active", !eraser && b.dataset.color === state.activeColor);
      }
      eraserBtn.classList.toggle("is-active", eraser);
      root3.classList.toggle("is-erasing", eraser);
    }
    syncTools = sync;
    sync();
    on("tool", sync);
  }
  function buildActionBar(bar) {
    clear(bar);
    bar.append(
      el("button.btn.btn-launch", {
        type: "button",
        html: uiIcon("rocket") + '<span class="btn-launch-text"><i>3</i>\u3046\u3061\u3042\u3052\u308B</span>',
        onClick: () => launch(false)
      }),
      el("button.btn.btn-big.btn-soft", {
        type: "button",
        title: "\u305C\u3093\u304C\u3081\u3093\u3067 \u3046\u3061\u3042\u3052\u308B\uFF08\u30D7\u30ED\u30B8\u30A7\u30AF\u30BF\u30FC\u7528\uFF09",
        html: uiIcon("expand") + "<span>\u305C\u3093\u304C\u3081\u3093</span>",
        onClick: () => launch(true)
      }),
      el("div.actionbar-spacer"),
      el("button.btn.btn-big.btn-soft", {
        type: "button",
        html: uiIcon("save") + "<span>\u307B\u305E\u3093</span>",
        onClick: saveShell2
      })
    );
  }
  function handleEditorKey(e) {
    const active = document.activeElement;
    const tag = active?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && e.key.toLowerCase() === "y") {
      e.preventDefault();
      redo();
      return;
    }
    if (mod && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveShell2();
      return;
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      if (state.selectedPelletId) {
        e.preventDefault();
        removePellet(state.selectedPelletId);
      }
      return;
    }
    if (e.key === "Escape") {
      if (eraser) {
        eraser = false;
        syncTools();
        render();
      }
      select(null);
      return;
    }
    if (e.key === " ") {
      if (tag === "BUTTON" || tag === "A") return;
      e.preventDefault();
      launch(false);
      return;
    }
    const sel = getSelected();
    if (sel && e.key.startsWith("Arrow")) {
      e.preventDefault();
      const step = e.shiftKey ? 0.3 : 0.05;
      const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
      const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
      nudgePellet(sel.id, dx, dy);
      return;
    }
    const num = Number(e.key);
    if (num >= 1 && num <= PELLET_COLORS.length) {
      eraser = false;
      setTool({ activeColor: PELLET_COLORS[num - 1].id });
      syncTools();
      render();
    }
  }

  // src/data/shared-gallery.js
  var SHARED_SHELLS = [
    {
      "id": "shell_muj9j3mp_9odg",
      "name": "\u307B\u3057",
      "shell": {
        "id": "shell_muj9j3mp_9odg",
        "name": "\u307B\u3057",
        "pellets": [
          {
            "id": "pel_shell_muj9j3mp_9odg_0",
            "x": -0.5546,
            "y": -1.9209,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_1",
            "x": 0.1417,
            "y": -1.1732,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_2",
            "x": 1.3738,
            "y": -1.2069,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_3",
            "x": 0.778,
            "y": -0.3787,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_4",
            "x": -0.7698,
            "y": -0.6751,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_5",
            "x": -1.6993,
            "y": -0.254,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_6",
            "x": -0.137,
            "y": 0.17,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_7",
            "x": -0.5979,
            "y": 1.0584,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_8",
            "x": 0.8181,
            "y": 0.6941,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_9",
            "x": 1.6668,
            "y": 1.3435,
            "color": "lemon"
          },
          {
            "id": "pel_shell_muj9j3mp_9odg_10",
            "x": -1.2147,
            "y": 1.8547,
            "color": "lemon"
          }
        ]
      },
      "createdAt": 1790483572074,
      "updatedAt": 1790483572074
    },
    {
      "id": "shell_muj8ynhb_ky27",
      "name": "\u308A\u3093\u3054",
      "shell": {
        "id": "shell_muj8ynhb_ky27",
        "name": "\u308A\u3093\u3054",
        "pellets": [
          {
            "id": "pel_shell_muj8ynhb_ky27_0",
            "x": -2.2223,
            "y": 0.7286,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_1",
            "x": -1.7002,
            "y": 1.6021,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_2",
            "x": -0.6671,
            "y": 1.6442,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_3",
            "x": -1.8405,
            "y": -0.2251,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_4",
            "x": -0.7315,
            "y": -0.3242,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_5",
            "x": 0.4193,
            "y": -0.3225,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_6",
            "x": 1.5616,
            "y": -0.2595,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_7",
            "x": 2.3723,
            "y": 0.4631,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_8",
            "x": -1.1303,
            "y": 0.7325,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_9",
            "x": -0.1238,
            "y": 0.6716,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_10",
            "x": 1.0607,
            "y": 0.6643,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_11",
            "x": 0.0295,
            "y": 2.4219,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_12",
            "x": 0.7002,
            "y": 1.6433,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_13",
            "x": 1.8102,
            "y": 1.6611,
            "color": "red"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_14",
            "x": -0.1832,
            "y": -2.308,
            "color": "green"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_15",
            "x": -0.2063,
            "y": -1.2816,
            "color": "green"
          },
          {
            "id": "pel_shell_muj8ynhb_ky27_16",
            "x": 0.6992,
            "y": -1.796,
            "color": "green"
          }
        ]
      },
      "createdAt": 1790483841968,
      "updatedAt": 1790483841968
    },
    {
      "id": "shell_mujbviix_ggl2",
      "name": "\u306B\u3053\u3061\u3083\u3093",
      "shell": {
        "id": "shell_mujbviix_ggl2",
        "name": "\u306B\u3053\u3061\u3083\u3093",
        "pellets": [
          {
            "id": "pel_shell_mujbviix_ggl2_0",
            "x": -2.0395,
            "y": -1.416,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_1",
            "x": -1.2058,
            "y": -2.1144,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_2",
            "x": -0.1975,
            "y": -2.3319,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_3",
            "x": 0.8306,
            "y": -2.3138,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_4",
            "x": 1.7275,
            "y": -1.7476,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_5",
            "x": 2.238,
            "y": -0.8641,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_6",
            "x": 2.3971,
            "y": 0.1348,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_7",
            "x": 2.1576,
            "y": 1.2572,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_8",
            "x": 1.3455,
            "y": 1.8851,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_9",
            "x": 0.4447,
            "y": 2.3308,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_10",
            "x": -0.6168,
            "y": 2.3097,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_11",
            "x": -1.5548,
            "y": 1.9215,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_12",
            "x": -2.2121,
            "y": 1.1165,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_13",
            "x": -2.4635,
            "y": 0.1358,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_14",
            "x": 1.0277,
            "y": -0.6311,
            "color": "red"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_15",
            "x": -0.8878,
            "y": -0.5666,
            "color": "green"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_16",
            "x": 1.2902,
            "y": 0.5683,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_17",
            "x": 0.5026,
            "y": 1.2183,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_18",
            "x": -0.5215,
            "y": 1.2877,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujbviix_ggl2_19",
            "x": -1.3391,
            "y": 0.6022,
            "color": "lemon"
          }
        ]
      },
      "createdAt": 1790483944220,
      "updatedAt": 1790483944220
    },
    {
      "id": "shell_mujbpur8_25cs",
      "name": "\u306F\u306A\u306E\uFF3F1\u53F7",
      "shell": {
        "id": "shell_mujbpur8_25cs",
        "name": "\u306F\u306A\u306E\uFF3F1\u53F7",
        "pellets": [
          {
            "id": "pel_shell_mujbpur8_25cs_0",
            "x": -0.2269,
            "y": -1.5696,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbpur8_25cs_1",
            "x": 0.9851,
            "y": -1.1692,
            "color": "red"
          },
          {
            "id": "pel_shell_mujbpur8_25cs_2",
            "x": 1.8045,
            "y": 0.1417,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujbpur8_25cs_3",
            "x": 1.1622,
            "y": 1.4431,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbpur8_25cs_4",
            "x": -0.5024,
            "y": 1.7203,
            "color": "green"
          },
          {
            "id": "pel_shell_mujbpur8_25cs_5",
            "x": -1.7852,
            "y": 0.9556,
            "color": "green"
          },
          {
            "id": "pel_shell_mujbpur8_25cs_6",
            "x": -2.1491,
            "y": -0.4921,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujbpur8_25cs_7",
            "x": -1.3335,
            "y": -1.4986,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujbpur8_25cs_8",
            "x": -0.4293,
            "y": 69e-4,
            "color": "white"
          }
        ]
      },
      "createdAt": 1790484236958,
      "updatedAt": 1790484278419
    },
    {
      "id": "shell_mujbz5lv_6x6r",
      "name": "\u3064\u3076\u3064\u3076\u3069\u3046",
      "shell": {
        "id": "shell_mujbz5lv_6x6r",
        "name": "\u3064\u3076\u3064\u3076\u3069\u3046",
        "pellets": [
          {
            "id": "pel_shell_mujbz5lv_6x6r_0",
            "x": -2.0208,
            "y": -0.6339,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_1",
            "x": -0.9189,
            "y": -0.5941,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_2",
            "x": 0.307,
            "y": -0.3547,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_3",
            "x": 1.4914,
            "y": -0.1622,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_4",
            "x": -1.4419,
            "y": 0.3387,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_5",
            "x": -0.3673,
            "y": 0.3989,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_6",
            "x": 0.8165,
            "y": 0.6214,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_7",
            "x": -0.9546,
            "y": 1.239,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_8",
            "x": 0.0897,
            "y": 1.4153,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_9",
            "x": -0.5205,
            "y": 2.2382,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_10",
            "x": -0.1624,
            "y": -1.3098,
            "color": "green"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_11",
            "x": 0.0279,
            "y": -2.3131,
            "color": "green"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_12",
            "x": -1.0195,
            "y": -2.1735,
            "color": "green"
          },
          {
            "id": "pel_shell_mujbz5lv_6x6r_13",
            "x": 1.0702,
            "y": -2.2585,
            "color": "green"
          }
        ]
      },
      "createdAt": 1790484348065,
      "updatedAt": 1790484348065
    },
    {
      "id": "shell_mujc4c5u_16km",
      "name": "\u307E\u3053\uFF3F\u82B1",
      "shell": {
        "id": "shell_mujc4c5u_16km",
        "name": "\u307E\u3053\uFF3F\u82B1",
        "pellets": [
          {
            "id": "pel_shell_mujc4c5u_16km_0",
            "x": -2.0953,
            "y": -1.2413,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_1",
            "x": -1.3321,
            "y": -2.0229,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_2",
            "x": -0.4076,
            "y": -2.4113,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_3",
            "x": 0.6389,
            "y": -2.2576,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_4",
            "x": 1.5906,
            "y": -1.7467,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_5",
            "x": 2.2687,
            "y": -0.9428,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_6",
            "x": -2.4839,
            "y": -0.2829,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_7",
            "x": -2.3457,
            "y": 0.7298,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_8",
            "x": -1.8255,
            "y": 1.598,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_9",
            "x": -1.0051,
            "y": 2.1882,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_10",
            "x": -0.033,
            "y": 2.4934,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_11",
            "x": 0.9992,
            "y": 2.2015,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_12",
            "x": 1.8518,
            "y": 1.5849,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_13",
            "x": 2.3043,
            "y": 0.6821,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_14",
            "x": -0.0232,
            "y": -1.3854,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_15",
            "x": -1.0751,
            "y": -0.8196,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_16",
            "x": -1.1351,
            "y": 0.2498,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_17",
            "x": -0.3895,
            "y": 0.9853,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_18",
            "x": 0.6315,
            "y": 0.9432,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_19",
            "x": 0.9652,
            "y": -0.9496,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_20",
            "x": 1.2222,
            "y": 0.0382,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc4c5u_16km_21",
            "x": -0.019,
            "y": -0.2111,
            "color": "purple"
          }
        ]
      },
      "createdAt": 1790484452849,
      "updatedAt": 1790484477567
    },
    {
      "id": "shell_mujaf4uq_fwx7",
      "name": "\u3046\u307F\u3068\u308A\u304F\u3068\u305D\u3089",
      "shell": {
        "id": "shell_mujaf4uq_fwx7",
        "name": "\u3046\u307F\u3068\u308A\u304F\u3068\u305D\u3089",
        "pellets": [
          {
            "id": "pel_shell_mujaf4uq_fwx7_0",
            "x": -1.4781,
            "y": -2.0162,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_1",
            "x": -0.4922,
            "y": -2.3356,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_2",
            "x": 0.5366,
            "y": -2.326,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_3",
            "x": 1.5261,
            "y": -1.9778,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_4",
            "x": 2.1816,
            "y": -1.1835,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_5",
            "x": 1.1249,
            "y": -1.0178,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_6",
            "x": 0.0601,
            "y": -1.4168,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_7",
            "x": -0.9238,
            "y": -1.1013,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_8",
            "x": -1.9644,
            "y": -1.0682,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_9",
            "x": 2.4872,
            "y": -0.1825,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_10",
            "x": 1.4628,
            "y": 0.0272,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_11",
            "x": 0.429,
            "y": -0.1677,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_12",
            "x": -0.5758,
            "y": -0.0637,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_13",
            "x": -1.5871,
            "y": -0.1123,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_14",
            "x": -2.4428,
            "y": 0.4684,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_15",
            "x": -1.3073,
            "y": 0.8862,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_16",
            "x": -0.2653,
            "y": 0.9093,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_17",
            "x": 0.7975,
            "y": 0.8128,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_18",
            "x": 1.8473,
            "y": 0.9754,
            "color": "green"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_19",
            "x": -1.7089,
            "y": 1.8215,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_20",
            "x": -0.6861,
            "y": 1.8398,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_21",
            "x": 0.3304,
            "y": 1.7408,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujaf4uq_fwx7_22",
            "x": 1.3901,
            "y": 1.9677,
            "color": "blue"
          }
        ]
      },
      "createdAt": 1790484558507,
      "updatedAt": 1790484757375
    },
    {
      "id": "shell_mujc69mg_eaj2",
      "name": "\u3055\u306A_\u65E5\u672C\u306E\u306F\u305F",
      "shell": {
        "id": "shell_mujc69mg_eaj2",
        "name": "\u3055\u306A_\u65E5\u672C\u306E\u306F\u305F",
        "pellets": [
          {
            "id": "pel_shell_mujc69mg_eaj2_0",
            "x": -0.622,
            "y": -0.2522,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_1",
            "x": 0.3639,
            "y": -0.4211,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_2",
            "x": -0.4996,
            "y": 0.7603,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_3",
            "x": 0.5117,
            "y": 0.6525,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_4",
            "x": -2.2435,
            "y": -0.666,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_5",
            "x": -2.0297,
            "y": 1.3391,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_6",
            "x": 1.3425,
            "y": -0.7029,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_7",
            "x": 1.4463,
            "y": 0.2948,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_8",
            "x": -1.2852,
            "y": 2.1173,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_9",
            "x": 0.7297,
            "y": 1.6348,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_10",
            "x": 1.7031,
            "y": 1.3547,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_11",
            "x": -1.4126,
            "y": -1.2563,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_12",
            "x": -0.3557,
            "y": -1.3994,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_13",
            "x": 0.6352,
            "y": -1.5865,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_14",
            "x": -0.2701,
            "y": 1.7969,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_15",
            "x": -2.4346,
            "y": 0.4208,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_16",
            "x": 1.8342,
            "y": -1.6468,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_17",
            "x": 2.337,
            "y": -0.5715,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_18",
            "x": 2.429,
            "y": 0.5754,
            "color": "white"
          },
          {
            "id": "pel_shell_mujc69mg_eaj2_19",
            "x": -1.428,
            "y": 0.366,
            "color": "white"
          }
        ]
      },
      "createdAt": 1790484620059,
      "updatedAt": 1790484920871
    },
    {
      "id": "shell_mujc9wbr_kv09",
      "name": "\u305F\u307E\u306E\u3000\u30AB\u30E9\u30D5\u30EB\u82B1\u706B",
      "shell": {
        "id": "shell_mujc9wbr_kv09",
        "name": "\u305F\u307E\u306E\u3000\u30AB\u30E9\u30D5\u30EB\u82B1\u706B",
        "pellets": [
          {
            "id": "pel_shell_mujc9wbr_kv09_0",
            "x": -0.3485,
            "y": -2.0235,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_1",
            "x": -1.3196,
            "y": -1.6355,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_2",
            "x": -1.8872,
            "y": -0.7713,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_3",
            "x": -2.0383,
            "y": 0.2408,
            "color": "red"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_4",
            "x": -1.7547,
            "y": 1.2419,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_5",
            "x": -0.8603,
            "y": 1.8803,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_6",
            "x": 0.3539,
            "y": 2.0973,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_7",
            "x": 1.491,
            "y": 1.6639,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_8",
            "x": 2.1643,
            "y": 0.802,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_9",
            "x": 2.3422,
            "y": -0.3729,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_10",
            "x": 2.0661,
            "y": -1.4075,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_11",
            "x": 0.8848,
            "y": -1.9454,
            "color": "green"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_12",
            "x": -0.5774,
            "y": -0.7373,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_13",
            "x": -0.5699,
            "y": 0.6329,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_14",
            "x": 0.7688,
            "y": -0.9284,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_15",
            "x": 1.1562,
            "y": 0.0149,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujc9wbr_kv09_16",
            "x": 0.4456,
            "y": 0.8941,
            "color": "purple"
          }
        ]
      },
      "createdAt": 1790484722928,
      "updatedAt": 1790484777913
    },
    {
      "id": "shell_mujcergs_6kc4",
      "name": "\u82B1\u306E\u6D77",
      "shell": {
        "id": "shell_mujcergs_6kc4",
        "name": "\u82B1\u306E\u6D77",
        "pellets": [
          {
            "id": "pel_shell_mujcergs_6kc4_0",
            "x": -0.0199,
            "y": 0.0223,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_1",
            "x": -0.0318,
            "y": -0.9779,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_2",
            "x": 0.0337,
            "y": 1.0285,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_3",
            "x": -0.9677,
            "y": -0.4303,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_4",
            "x": -0.9447,
            "y": 0.648,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_5",
            "x": 0.8791,
            "y": -0.4874,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_6",
            "x": 0.9894,
            "y": 0.5217,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_7",
            "x": 0.1625,
            "y": 2.0452,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_8",
            "x": 1.8697,
            "y": 1.002,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_9",
            "x": 1.8811,
            "y": -0.7161,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_10",
            "x": 0.0579,
            "y": -1.9783,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_11",
            "x": -1.9528,
            "y": -0.7163,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcergs_6kc4_12",
            "x": -1.9637,
            "y": 1.0933,
            "color": "blue"
          }
        ]
      },
      "createdAt": 1790484890189,
      "updatedAt": 1790485450321
    },
    {
      "id": "shell_mujcivlu_6m5i",
      "name": "\u3088\u308A\u307F\u30611\u53F7",
      "shell": {
        "id": "shell_mujcivlu_6m5i",
        "name": "\u3088\u308A\u307F\u30611\u53F7",
        "pellets": [
          {
            "id": "pel_shell_mujcivlu_6m5i_0",
            "x": -0.0491,
            "y": 85e-4,
            "color": "green"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_1",
            "x": -0.1287,
            "y": -1.4372,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_2",
            "x": -2.0196,
            "y": -0.8279,
            "color": "purple"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_3",
            "x": 1.3246,
            "y": 0.622,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_4",
            "x": -0.5388,
            "y": 1.4089,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_5",
            "x": 0.8885,
            "y": -0.8846,
            "color": "white"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_6",
            "x": -2.1844,
            "y": 0.8711,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_7",
            "x": 0.7627,
            "y": 1.6454,
            "color": "green"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_8",
            "x": -0.9958,
            "y": -0.902,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_9",
            "x": -1.2689,
            "y": 0.2506,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_10",
            "x": 2.0752,
            "y": -0.8401,
            "color": "blue"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_11",
            "x": -1.689,
            "y": -1.8378,
            "color": "lemon"
          },
          {
            "id": "pel_shell_mujcivlu_6m5i_12",
            "x": 0.9147,
            "y": -1.9329,
            "color": "green"
          }
        ]
      },
      "createdAt": 1790485261134,
      "updatedAt": 1790485261134
    },
    {
      "id": "shell_mujcfkev_3qzv",
      "name": "\u3042\u304B",
      "shell": {
        "id": "shell_mujcfkev_3qzv",
        "name": "\u3042\u304B",
        "pellets": [
          {
            "id": "pel_shell_mujcfkev_3qzv_0",
            "x": -1.5176,
            "y": 1.8548,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_1",
            "x": -1.6662,
            "y": -1.8248,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_2",
            "x": -0.0664,
            "y": -2.4991,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_3",
            "x": 0.9862,
            "y": -2.2498,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_4",
            "x": -2.4362,
            "y": 0.0694,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_5",
            "x": -0.6451,
            "y": -1.6711,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_6",
            "x": 1.838,
            "y": -1.6596,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_7",
            "x": -2.1929,
            "y": 1.0844,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_8",
            "x": -2.2621,
            "y": -1.0176,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_9",
            "x": 2.3604,
            "y": -0.7605,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_10",
            "x": 0.3845,
            "y": 2.4534,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_11",
            "x": 2.4438,
            "y": 0.2995,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_12",
            "x": 1.4113,
            "y": 2.0178,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_13",
            "x": 2.12,
            "y": 1.2747,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_14",
            "x": -0.6711,
            "y": 2.4024,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_15",
            "x": 1.2803,
            "y": -0.0171,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_16",
            "x": -1.2008,
            "y": -0.8111,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_17",
            "x": -0.8216,
            "y": 1.0683,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_18",
            "x": 1.1101,
            "y": 1.0312,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_19",
            "x": -1.3645,
            "y": 0.2201,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_20",
            "x": 0.1288,
            "y": 1.451,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_21",
            "x": 1.0429,
            "y": -1.0323,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_22",
            "x": 0.3057,
            "y": 0.433,
            "color": "red"
          },
          {
            "id": "pel_shell_mujcfkev_3qzv_23",
            "x": -0.2418,
            "y": -0.4693,
            "color": "red"
          }
        ]
      },
      "createdAt": 1790485478989,
      "updatedAt": 1790486209782
    }
  ];

  // src/gallery/gallery.js
  var shared = SHARED_SHELLS.map((r) => ({ ...r, shell: normalizeShell(r.shell), thumbnail: "" }));
  var listEl = null;
  var headEl = null;
  var handlers = {};
  function mountGallery(root3, h = {}) {
    handlers = h;
    headEl = qs("#gallery-head", root3);
    listEl = qs("#gallery-list", root3);
    render2();
    return { render: render2 };
  }
  function render2() {
    if (!listEl) return;
    const records = listShells();
    const ownIds = new Set(records.map((r) => r.id));
    const showRecords = [...shared.filter((r) => !ownIds.has(r.id)), ...records];
    clear(headEl);
    headEl.append(
      el("div.gallery-heading", {}, [
        el("h2.gallery-title", {}, ["\u30AE\u30E3\u30E9\u30EA\u30FC"]),
        el("span.gallery-count", {}, [`${showRecords.length} \u306F\u3064`])
      ]),
      el("div.gallery-actions", {}, [
        el("button.btn.btn-big.btn-accent", {
          type: "button",
          disabled: showRecords.length === 0,
          html: uiIcon("rocket") + "<span>\u307F\u3093\u306A\u306E\u82B1\u706B\u3092 \u6253\u3061\u4E0A\u3052\u308B</span>",
          onClick: () => playShow2(showRecords)
        }),
        el("button.btn.btn-ghost", {
          type: "button",
          html: uiIcon("save") + "<span>\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7</span>",
          title: "\u3059\u3079\u3066\u306E\u82B1\u706B\u7389\u3092 JSON \u30D5\u30A1\u30A4\u30EB\u306B\u66F8\u304D\u51FA\u3059",
          disabled: records.length === 0,
          onClick: exportAll2
        }),
        el("label.btn.btn-ghost.file-btn", {}, [
          el("span", { html: uiIcon("gallery") }),
          el("span", {}, ["\u3088\u307F\u3053\u307F"]),
          el("input", { type: "file", accept: "application/json,.json", onChange: importFile })
        ])
      ])
    );
    clear(listEl);
    if (shared.length) {
      listEl.append(sectionTitle("\u307F\u3093\u306A\u306E\u82B1\u706B", shared.length));
      for (const rec of shared) listEl.append(sharedCard(rec));
      listEl.append(sectionTitle("\u3058\u3076\u3093\u306E\u82B1\u706B", records.length));
    }
    if (!records.length) {
      listEl.append(
        el("div.gallery-empty", {}, [
          el("div.gallery-empty-emoji", {}, ["\u{1F386}"]),
          el("p", {}, ["\u307E\u3060 \u3058\u3076\u3093\u306E \u82B1\u706B\u7389\u304C \u3042\u308A\u307E\u305B\u3093"]),
          el("button.btn.btn-primary.btn-big", {
            type: "button",
            html: uiIcon("brush") + "<span>\u3064\u304F\u308A\u306B \u3044\u304F</span>",
            onClick: () => handlers.onGoEditor?.()
          })
        ])
      );
      return;
    }
    for (const rec of records) listEl.append(card(rec));
  }
  function sectionTitle(label, count) {
    return el("h3.gallery-section", {}, [label, el("span.gallery-count", {}, [`${count} \u306F\u3064`])]);
  }
  function sharedCard(rec) {
    if (!rec.thumbnail) rec.thumbnail = renderShellThumbnail(rec.shell, 256);
    return el("article.g-card", {}, [
      el("button.g-thumb", {
        type: "button",
        title: "\u3046\u3061\u3042\u3052\u308B",
        onClick: () => launch2(rec),
        html: `<img src="${rec.thumbnail}" alt="${escapeHtml(rec.name)}" loading="lazy"><span class="g-play">${uiIcon("rocket")}</span>`
      }),
      el("div.g-body", {}, [
        el("div.g-name", { title: rec.name }, [rec.name]),
        el("div.g-meta", {}, [`\u307B\u3057 ${rec.shell.pellets.length} \u3053`])
      ]),
      el("div.g-actions", {}, [
        el("button.icon-btn", {
          type: "button",
          title: "\u3046\u3061\u3042\u3052\u308B",
          html: uiIcon("rocket"),
          onClick: () => launch2(rec)
        }),
        el("button.icon-btn", {
          type: "button",
          title: "\u30B3\u30D4\u30FC\u3057\u3066 \u3078\u3093\u3057\u3085\u3046",
          html: uiIcon("edit"),
          onClick: () => {
            const copy = cloneShell(rec.shell);
            copy.id = uid("shell");
            copy.pellets = copy.pellets.map((p) => ({ ...p, id: uid("pel") }));
            handlers.onEdit?.({ ...rec, id: copy.id, shell: copy });
          }
        })
      ])
    ]);
  }
  function card(rec) {
    const thumb = rec.thumbnail || renderShellThumbnail(rec.shell, 256);
    return el("article.g-card", {}, [
      el("button.g-thumb", {
        type: "button",
        title: "\u3046\u3061\u3042\u3052\u308B",
        onClick: () => launch2(rec),
        html: `<img src="${thumb}" alt="${escapeHtml(rec.name)}" loading="lazy"><span class="g-play">${uiIcon("rocket")}</span>`
      }),
      el("div.g-body", {}, [
        el("div.g-name", { title: rec.name }, [rec.name]),
        el("div.g-meta", {}, [
          `\u307B\u3057 ${rec.shell.pellets.length} \u3053`,
          el("span.g-dot", {}, ["\u30FB"]),
          formatDate(rec.updatedAt)
        ])
      ]),
      el("div.g-actions", {}, [
        el("button.icon-btn", {
          type: "button",
          title: "\u3046\u3061\u3042\u3052\u308B",
          html: uiIcon("rocket"),
          onClick: () => launch2(rec)
        }),
        el("button.icon-btn", {
          type: "button",
          title: "\u3078\u3093\u3057\u3085\u3046",
          html: uiIcon("edit"),
          onClick: () => handlers.onEdit?.(rec)
        }),
        el("button.icon-btn", {
          type: "button",
          title: "\u3075\u304F\u305B\u3044",
          html: uiIcon("copy"),
          onClick: () => {
            if (duplicateShell(rec.id)) {
              showToast("\u3075\u304F\u305B\u3044 \u3057\u307E\u3057\u305F", "success");
              render2();
            }
          }
        }),
        el("button.icon-btn.icon-btn-danger", {
          type: "button",
          title: "\u3055\u304F\u3058\u3087",
          html: uiIcon("trash"),
          onClick: async () => {
            const ok = await confirmDialog({
              title: "\u3055\u304F\u3058\u3087 \u3057\u307E\u3059\u304B\uFF1F",
              message: `\u300C${rec.name}\u300D\u3092 \u3051\u3057\u307E\u3059\u3002\u3082\u3068\u306B \u3082\u3069\u305B\u307E\u305B\u3093\u3002`,
              okLabel: "\u3051\u3059",
              danger: true
            });
            if (!ok) return;
            deleteShell(rec.id);
            showToast("\u3055\u304F\u3058\u3087 \u3057\u307E\u3057\u305F", "info");
            render2();
          }
        })
      ])
    ]);
  }
  function launch2(rec) {
    launchShell(rec.shell, { fullscreen: true, title: rec.name });
  }
  function playShow2(records) {
    const entries = [...records].sort((a, b) => a.createdAt - b.createdAt).map((r) => ({ name: r.name, shell: r.shell }));
    playShow(entries, { fullscreen: true });
  }
  function exportAll2() {
    const json = exportAll();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = /* @__PURE__ */ new Date();
    const p = (n) => String(n).padStart(2, "0");
    a.href = url;
    a.download = `digital-fireworks-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    showToast("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3092 \u307B\u305E\u3093\u3057\u307E\u3057\u305F", "success");
  }
  function importFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importAll(String(reader.result), { merge: true });
      if (!res.ok) {
        showToast(res.error || "\u3088\u307F\u3053\u3081\u307E\u305B\u3093\u3067\u3057\u305F", "error");
        return;
      }
      showToast(`${res.count} \u306F\u3064 \u3088\u307F\u3053\u307F\u307E\u3057\u305F`, "success");
      render2();
    };
    reader.readAsText(file);
  }
  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );
  }

  // src/main.js
  var editorApi = null;
  var currentScreen = "editor";
  function showScreen(name) {
    currentScreen = name;
    for (const s of qsa(".screen")) s.classList.toggle("is-active", s.dataset.screen === name);
    setActive(qsa(".tab"), qs(`.tab[data-screen="${name}"]`));
    if (name === "gallery") render2();
    if (name === "editor") editorApi?.refreshSize();
  }
  function buildTopbar() {
    const undoBtn = qs("#btn-undo");
    const redoBtn = qs("#btn-redo");
    undoBtn.innerHTML = uiIcon("undo") + "<span>\u3082\u3069\u3059</span>";
    redoBtn.innerHTML = uiIcon("redo") + "<span>\u3084\u308A\u306A\u304A\u3059</span>";
    undoBtn.addEventListener("click", () => undo());
    redoBtn.addEventListener("click", () => redo());
    const soundBtn = qs("#btn-sound");
    const syncSound = () => {
      soundBtn.innerHTML = uiIcon(state.sound ? "sound" : "mute");
      soundBtn.classList.toggle("is-off", !state.sound);
      soundBtn.title = state.sound ? "\u304A\u3068\u3092 \u3051\u3059" : "\u304A\u3068\u3092 \u3060\u3059";
      setSoundEnabled(state.sound);
    };
    soundBtn.addEventListener("click", () => {
      setView({ sound: !state.sound });
      syncSound();
    });
    syncSound();
    const newBtn = qs("#btn-new");
    newBtn.innerHTML = uiIcon("brush") + "<span>\u3042\u305F\u3089\u3057\u304F</span>";
    newBtn.addEventListener("click", () => newShell2());
    for (const tab of qsa(".tab")) {
      tab.addEventListener("click", () => showScreen(tab.dataset.screen));
    }
  }
  function boot() {
    if (!isStorageAvailable()) {
      showToast("\u3053\u306E \u30D6\u30E9\u30A6\u30B6\u3067\u306F \u307B\u305E\u3093\u304C \u3064\u304B\u3048\u307E\u305B\u3093", "warn", 4e3);
    }
    const draft = loadDraft();
    if (draft && draft.pellets.length) setShell(draft, { dirty: true });
    buildTopbar();
    editorApi = mountShellEditor(qs("#screen-editor"), { onSaved: () => render2() });
    mountGallery(qs("#screen-gallery"), {
      onGoEditor: () => showScreen("editor"),
      onEdit: (rec) => {
        setShell(cloneShell(rec.shell));
        showScreen("editor");
        showToast(`\u300C${rec.name}\u300D\u3092 \u3072\u3089\u304D\u307E\u3057\u305F`, "info");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (isOpen()) return;
      if (currentScreen !== "editor") return;
      if (qs(".modal-backdrop")) return;
      handleEditorKey(e);
    });
    const firstRun = !draft?.pellets.length && listShells().length === 0;
    if (firstRun) {
      setTimeout(() => {
        if (isOpen() || qs(".modal-backdrop")) return;
        if (state.shell.pellets.length) return;
        openPresets();
      }, 450);
    }
    showScreen("editor");
    document.body.classList.remove("is-loading");
    window.digitalFireworks = { store: state_exports, storage: storage_exports, player: player_exports, showScreen };
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
