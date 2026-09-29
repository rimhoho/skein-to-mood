const COLOR_GROUPS = [
  { id: "pink", label: "Pink", hex: "#d998a7", terms: ["pink", "rose", "blush", "coral"] },
  { id: "red", label: "Red", hex: "#a94748", terms: ["red", "currant", "berry", "wine", "magenta"] },
  { id: "yellow", label: "Yellow", hex: "#d6ad32", terms: ["yellow", "gold", "ochre", "mustard", "citron", "raisin", "saffron", "citrus"] },
  { id: "green", label: "Green", hex: "#667f5d", terms: ["green", "sage", "olive", "moss", "forest", "pine", "lime", "chartreuse", "mint"] },
  { id: "blue", label: "Blue", hex: "#5d8797", terms: ["blue", "aqua", "teal", "turquoise", "seafoam", "petrol", "periwinkle"] },
  { id: "purple", label: "Purple", hex: "#806682", terms: ["purple", "plum", "violet", "lavender", "mauve"] },
  { id: "brown", label: "Brown", hex: "#806554", terms: ["brown", "taupe", "cacao", "bronze", "rust"] },
  { id: "neutral", label: "Neutral", hex: "#d8d0c2", terms: ["cream", "white", "grey", "gray", "beige", "oatmeal", "linen", "natural", "sand", "stone", "wheat", "flour", "mushroom", "charcoal", "black"] }
];

const COLOR_HEX = Object.fromEntries(COLOR_GROUPS.map((group) => [group.id, group.hex]));
const TRANSLATIONS = {
  en: {
    pageTitle: "My Stash | Skein to Mood",
    pageDescription: "A personal yarn collection to browse by color, weight, brand, and fiber.",
    brandHome: "Skein to Mood home",
    mainMenu: "Main menu",
    languageSelector: "Choose language",
    navYarn: "Yarn",
    navPattern: "Pattern",
    navItems: "My Items",
    navTaste: "Taste",
    skeins: "skeins",
    yarns: "yarns",
    heroEyebrow: "Personal yarn archive",
    heroTitle: "My Stash",
    heroNote: "A small closet where yarn is rediscovered through color and texture.",
    stashSummary: "Stash summary",
    statYarns: "Yarns",
    statSkeins: "Skeins",
    statBrands: "Brands",
    statBases: "Bases",
    collectionEyebrow: "The collection",
    collectionTitle: "Stash library",
    filters: "Filters",
    yarnFilters: "Yarn filters",
    reset: "Reset",
    search: "Search",
    searchPlaceholder: "Colorway, base, mood...",
    brand: "Brand",
    weight: "Weight",
    yarnBase: "Yarn base",
    fiber: "Fiber",
    color: "Color",
    allBases: "All bases",
    allFibers: "All fibers",
    sort: "Sort",
    sortBrand: "Brand A-Z",
    sortColorway: "Colorway A-Z",
    sortQuantity: "Most skeins",
    sortWeight: "Weight",
    viewMode: "View mode",
    grid: "Grid",
    list: "List",
    emptyTitle: "No yarns found",
    emptyNote: "Try widening the filters a little.",
    clearFilters: "Clear filters",
    footerNote: "A personal yarn closet, catalogued by color and feeling.",
    backToTop: "Back to top ↑",
    closeDetails: "Close yarn details",
    photoSoon: "Photo coming soon",
    viewDetails: "View details",
    representativeColors: "Representative colors",
    inStash: "In stash",
    skein: "Skein",
    needles: "Needles",
    colors: "Colors",
    notRecorded: "Not recorded",
    stashNote: "Stash note",
    patternIdeas: "Pattern ideas",
    loadErrorTitle: "Could not load the stash.",
    loadErrorNote: "Please refresh the page.",
    colorNames: { pink: "Pink", red: "Red", yellow: "Yellow", green: "Green", blue: "Blue", purple: "Purple", brown: "Brown", neutral: "Neutral" },
    weightNames: { Lace: "Lace", Fingering: "Fingering", Sport: "Sport", "DK / Worsted": "DK / Worsted", Unspecified: "Unspecified" }
  },
  ko: {
    pageTitle: "나의 실 보관함 | Skein to Mood",
    pageDescription: "색상, 굵기, 브랜드와 소재로 찾아보는 개인 실 컬렉션.",
    brandHome: "Skein to Mood 홈",
    mainMenu: "주요 메뉴",
    languageSelector: "언어 선택",
    navYarn: "실 보관함",
    navPattern: "패턴 보관함",
    navItems: "나의 아이템",
    navTaste: "취향 보관함",
    skeins: "타래",
    yarns: "종류",
    heroEyebrow: "개인 실 아카이브",
    heroTitle: "나의 실 보관함",
    heroNote: "모아둔 실을 색과 촉감으로 다시 만나는 작은 클로젯.",
    stashSummary: "보관함 요약",
    statYarns: "실 종류",
    statSkeins: "타래 수",
    statBrands: "브랜드",
    statBases: "베이스",
    collectionEyebrow: "컬렉션",
    collectionTitle: "실 보관함",
    filters: "필터",
    yarnFilters: "실 필터",
    reset: "초기화",
    search: "검색",
    searchPlaceholder: "컬러웨이, 베이스, 무드...",
    brand: "브랜드",
    weight: "굵기",
    yarnBase: "실 베이스",
    fiber: "소재",
    color: "색상",
    allBases: "모든 베이스",
    allFibers: "모든 소재",
    sort: "정렬",
    sortBrand: "브랜드 가나다순",
    sortColorway: "컬러웨이 가나다순",
    sortQuantity: "타래 많은 순",
    sortWeight: "굵기순",
    viewMode: "보기 방식",
    grid: "격자",
    list: "목록",
    emptyTitle: "조건에 맞는 실이 없어요",
    emptyNote: "필터를 조금 넓혀보세요.",
    clearFilters: "필터 지우기",
    footerNote: "색과 감각으로 정리한 나만의 작은 실 클로젯.",
    backToTop: "맨 위로 ↑",
    closeDetails: "실 상세 정보 닫기",
    photoSoon: "사진 준비 중",
    viewDetails: "상세 보기",
    representativeColors: "대표 색상",
    inStash: "보유 수량",
    skein: "한 타래",
    needles: "바늘",
    colors: "색상",
    notRecorded: "기록 없음",
    stashNote: "보관 메모",
    patternIdeas: "패턴 아이디어",
    loadErrorTitle: "보관함을 불러오지 못했어요.",
    loadErrorNote: "페이지를 새로고침해 주세요.",
    colorNames: { pink: "핑크", red: "레드", yellow: "옐로", green: "그린", blue: "블루", purple: "퍼플", brown: "브라운", neutral: "뉴트럴" },
    weightNames: { Lace: "레이스", Fingering: "핑거링", Sport: "스포츠", "DK / Worsted": "DK / 워스티드", Unspecified: "미지정" }
  }
};
const IMAGE_ALIASES = {
  "purl-soho-cashmere-merino-bloom-wheat-flour": "purl-soho-cashmere-merino-bloom"
};
const BASE_ALIASES = {
  "Yak": "Yak Single"
};
const state = {
  search: "",
  brands: new Set(),
  weights: new Set(),
  base: "all",
  fiber: "all",
  colors: new Set(),
  sort: "brand",
  view: "grid",
  language: getInitialLanguage()
};

const elements = {
  grid: document.querySelector("#yarnGrid"),
  resultCount: document.querySelector("#resultCount"),
  activeFilters: document.querySelector("#activeFilters"),
  emptyState: document.querySelector("#emptyState"),
  dialog: document.querySelector("#yarnDialog"),
  dialogContent: document.querySelector("#dialogContent"),
  filters: document.querySelector("#filters"),
  mobileFilterButton: document.querySelector("#mobileFilterButton"),
  mobileFilterCount: document.querySelector("#mobileFilterCount"),
  filterBackdrop: document.querySelector("#filterBackdrop")
};

let yarns = [];

init().catch((error) => {
  console.error(error);
  elements.grid.innerHTML = `<div class="load-error"><h3>${t("loadErrorTitle")}</h3><p>${t("loadErrorNote")}</p></div>`;
});

async function init() {
  const [basesResponse, stashResponse] = await Promise.all([
    fetch("./data/shop-yarn-bases.json"),
    fetch("./data/my-yarn-stash.json")
  ]);
  if (!basesResponse.ok || !stashResponse.ok) throw new Error("Could not load stash data");

  const [bases, stash] = await Promise.all([basesResponse.json(), stashResponse.json()]);
  const basesById = Object.fromEntries(bases.map((base) => [base.id, base]));
  yarns = stash.map((item, index) => normalizeYarn({ ...basesById[item.base_id], ...item }, index));

  applyLanguage();
  buildFilterControls();
  updateStats();
  bindEvents();
  render();
}

function normalizeYarn(item, index) {
  const colors = item.color_family || item.colors || [];
  const rawBase = item.base || item.base_name || "Unknown base";
  return {
    ...item,
    index,
    base: BASE_ALIASES[rawBase] || rawBase,
    colors,
    fibers: normalizeFibers(item),
    weight: normalizeWeight(item.weight_category || item.weight || "Unspecified"),
    quantity: Number(item.quantity || 0),
    image: `./assets/images/yarn/${IMAGE_ALIASES[item.id] || item.id}.png`,
    colorGroups: COLOR_GROUPS.filter((group) =>
      colors.some((color) => group.terms.some((term) => color.toLowerCase().includes(term)))
    ).map((group) => group.id)
  };
}

function normalizeWeight(value) {
  const text = String(value).toLowerCase();
  if (text.includes("lace")) return "Lace";
  if (text.includes("fingering")) return "Fingering";
  if (text.includes("sport")) return "Sport";
  if (text.includes("dk") || text.includes("worsted") || text.includes("aran")) return "DK / Worsted";
  return "Unspecified";
}

function normalizeFibers(item) {
  if (item.fiber_content) return Object.keys(item.fiber_content).map(formatLabel);
  if (item.fibres) return item.fibres.map((fiber) => formatLabel(typeof fiber === "string" ? fiber : fiber.fibre));
  return [];
}

function formatLabel(value) {
  return String(value).replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getInitialLanguage() {
  return window.SiteState.getLanguage();
}

function t(key) {
  return TRANSLATIONS[state.language][key] ?? TRANSLATIONS.en[key] ?? key;
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]').content = t("pageDescription");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === state.language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active);
  });
}

function setLanguage(language, { persist = true } = {}) {
  if (!TRANSLATIONS[language] || language === state.language) return;
  state.language = language;
  if (persist) window.SiteState.setLanguage(language);

  applyLanguage();
  buildFilterControls();
  render();
  const openYarnId = elements.dialog.dataset.yarnId;
  if (elements.dialog.open && openYarnId) openYarn(openYarnId);
}

window.addEventListener("site-language-change", (event) => setLanguage(event.detail.language, { persist: false }));

function colorLabel(id) {
  return t("colorNames")[id] || id;
}

function weightLabel(weight) {
  return t("weightNames")[weight] || weight;
}

function buildFilterControls() {
  const brands = unique(yarns.map((yarn) => yarn.brand));
  const weights = ["Lace", "Fingering", "Sport", "DK / Worsted", "Unspecified"]
    .filter((weight) => yarns.some((yarn) => yarn.weight === weight));
  const bases = unique(yarns.map((yarn) => yarn.base));
  const fibers = unique(yarns.flatMap((yarn) => yarn.fibers));

  document.querySelector("#brandFilters").innerHTML = brands.map((brand) => choiceTemplate("brand", brand)).join("");
  document.querySelector("#weightFilters").innerHTML = weights.map((weight) => choiceTemplate("weight", weight)).join("");
  document.querySelector("#baseFilter").innerHTML = `<option value="all">${t("allBases")}</option>${bases.map(optionTemplate).join("")}`;
  document.querySelector("#fiberFilter").innerHTML = `<option value="all">${t("allFibers")}</option>${fibers.map(optionTemplate).join("")}`;
  document.querySelector("#baseFilter").value = state.base;
  document.querySelector("#fiberFilter").value = state.fiber;
  document.querySelector("#colorFilters").innerHTML = COLOR_GROUPS
    .filter((group) => yarns.some((yarn) => yarn.colorGroups.includes(group.id)))
    .map((group) => `
      <label class="color-choice" title="${colorLabel(group.id)}">
        <input type="checkbox" data-filter="color" value="${group.id}" ${state.colors.has(group.id) ? "checked" : ""} />
        <span class="color-dot" style="--swatch: ${group.hex}"></span>
        <span>${colorLabel(group.id)}</span>
      </label>`).join("");
}

function choiceTemplate(type, value) {
  const count = yarns.filter((yarn) => type === "brand" ? yarn.brand === value : yarn.weight === value).length;
  const selectedValues = type === "brand" ? state.brands : state.weights;
  return `
    <label class="filter-choice">
      <input type="checkbox" data-filter="${type}" value="${escapeHtml(value)}" ${selectedValues.has(value) ? "checked" : ""} />
      <span>${escapeHtml(type === "weight" ? weightLabel(value) : value)}</span>
      <small>${count}</small>
    </label>`;
}

function optionTemplate(value) {
  return `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`;
}

function updateStats() {
  const totalSkeins = yarns.reduce((total, yarn) => total + yarn.quantity, 0);
  document.querySelector("#itemStat").textContent = yarns.length;
  document.querySelector("#skeinStat").textContent = totalSkeins;
  document.querySelector("#brandStat").textContent = unique(yarns.map((yarn) => yarn.brand)).length;
  document.querySelector("#baseStat").textContent = unique(yarns.map((yarn) => yarn.base)).length;
  document.querySelector("#headerCount").textContent = totalSkeins;
}

function bindEvents() {
  document.querySelector("#searchInput").addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    render();
  });

  elements.filters.addEventListener("change", (event) => {
    const input = event.target.closest("input[data-filter]");
    if (!input) return;
    const collection = input.dataset.filter === "brand"
      ? state.brands
      : input.dataset.filter === "weight" ? state.weights : state.colors;

    if (input.dataset.filter === "color" && input.checked) {
      document.querySelectorAll('input[data-filter="color"]').forEach((colorInput) => {
        if (colorInput !== input) colorInput.checked = false;
      });
      state.colors.clear();
    }

    input.checked ? collection.add(input.value) : collection.delete(input.value);
    render();
  });

  document.querySelector("#baseFilter").addEventListener("change", (event) => {
    state.base = event.target.value;
    render();
  });
  document.querySelector("#fiberFilter").addEventListener("change", (event) => {
    state.fiber = event.target.value;
    render();
  });
  document.querySelector("#sortSelect").addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      document.querySelectorAll("[data-view]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", active);
      });
      elements.grid.classList.toggle("list-view", state.view === "list");
    });
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  document.querySelector("#resetFilters").addEventListener("click", resetFilters);
  document.querySelector("#emptyReset").addEventListener("click", resetFilters);
  document.querySelector("#closeDialog").addEventListener("click", () => elements.dialog.close());
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) elements.dialog.close();
  });
  elements.mobileFilterButton.addEventListener("click", toggleMobileFilters);
  elements.filterBackdrop.addEventListener("click", closeMobileFilters);
}

function render() {
  const filtered = getFilteredYarns();
  elements.resultCount.textContent = filtered.length;
  elements.grid.innerHTML = filtered.map(cardTemplate).join("");
  elements.grid.classList.toggle("list-view", state.view === "list");
  elements.emptyState.hidden = filtered.length !== 0;
  elements.grid.hidden = filtered.length === 0;

  elements.grid.querySelectorAll(".yarn-card").forEach((card) => {
    card.addEventListener("click", () => openYarn(card.dataset.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openYarn(card.dataset.id);
      }
    });
  });
  elements.grid.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => image.closest(".yarn-photo").classList.add("image-missing"), { once: true });
  });
  renderActiveFilters();
}

function getFilteredYarns() {
  return yarns.filter((yarn) => {
    const haystack = [yarn.brand, yarn.base, yarn.colorway, yarn.weight, ...yarn.colors, ...(yarn.mood || []), ...(yarn.texture || [])]
      .join(" ").toLowerCase();
    return (!state.search || haystack.includes(state.search))
      && (!state.brands.size || state.brands.has(yarn.brand))
      && (!state.weights.size || state.weights.has(yarn.weight))
      && (state.base === "all" || yarn.base === state.base)
      && (state.fiber === "all" || yarn.fibers.includes(state.fiber))
      && (!state.colors.size || [...state.colors].some((color) => yarn.colorGroups.includes(color)));
  }).sort(sortYarns);
}

function sortYarns(a, b) {
  if (state.sort === "colorway") return a.colorway.localeCompare(b.colorway);
  if (state.sort === "quantity") return b.quantity - a.quantity || a.colorway.localeCompare(b.colorway);
  if (state.sort === "weight") return weightOrder(a.weight) - weightOrder(b.weight) || a.colorway.localeCompare(b.colorway);
  return a.brand.localeCompare(b.brand) || a.colorway.localeCompare(b.colorway);
}

function weightOrder(weight) {
  return ["Lace", "Fingering", "Sport", "DK / Worsted", "Unspecified"].indexOf(weight);
}

function cardTemplate(yarn) {
  const palette = yarn.palette_hex?.length ? yarn.palette_hex : yarn.colorGroups.slice(0, 3).map((color) => COLOR_HEX[color]);
  const swatches = palette.slice(0, 4).map((color) => `<i style="--swatch: ${color}"></i>`).join("");
  const fallback = palette.join(", ") || "#d8d0c2, #aaa399";
  return `
    <article class="yarn-card" data-id="${yarn.id}" tabindex="0" role="button" aria-label="${escapeHtml(`${yarn.colorway} ${t("viewDetails")}`)}">
      <div class="yarn-photo" style="--fallback: linear-gradient(135deg, ${fallback})">
        <img src="${yarn.image}" alt="${escapeHtml(`${yarn.brand} ${yarn.colorway}`)}" loading="lazy" />
        <span class="brand-badge">${escapeHtml(yarn.brand)}</span>
        <span class="quantity-badge">×${formatQuantity(yarn.quantity)}</span>
        <span class="missing-label">${t("photoSoon")}</span>
      </div>
      <div class="yarn-card-body">
        <div class="card-title-row">
          <div>
            <p class="yarn-base">${escapeHtml(yarn.base)}</p>
            <h3>${escapeHtml(yarn.colorway)}</h3>
          </div>
          <div class="mini-swatches" aria-label="${t("representativeColors")}">${swatches}</div>
        </div>
        <div class="card-meta">
          <span>${escapeHtml(weightLabel(yarn.weight))}</span>
          <span>${yarn.skein_weight_g ? `${yarn.skein_weight_g}g` : formatSkeinCount(yarn.quantity)}</span>
          ${yarn.yardage_m ? `<span>${formatNumber(yarn.yardage_m)}m</span>` : ""}
        </div>
      </div>
    </article>`;
}

function renderActiveFilters() {
  const filters = [
    ...[...state.brands].map((value) => ({ type: "brands", value, label: value })),
    ...[...state.weights].map((value) => ({ type: "weights", value, label: value })),
    ...[...state.colors].map((value) => ({ type: "colors", value, label: colorLabel(value) })),
    ...(state.base !== "all" ? [{ type: "base", value: state.base, label: state.base }] : []),
    ...(state.fiber !== "all" ? [{ type: "fiber", value: state.fiber, label: state.fiber }] : [])
  ];

  elements.activeFilters.innerHTML = filters.map((filter) => `
    <button type="button" data-type="${filter.type}" data-value="${escapeHtml(filter.value)}">
      ${escapeHtml(filter.label)} <span aria-hidden="true">×</span>
    </button>`).join("");
  elements.activeFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => removeFilter(button.dataset.type, button.dataset.value));
  });

  const activeCount = filters.length + (state.search ? 1 : 0);
  elements.mobileFilterCount.textContent = activeCount;
  elements.mobileFilterCount.hidden = activeCount === 0;
}

function removeFilter(type, value) {
  if (["brands", "weights", "colors"].includes(type)) {
    state[type].delete(value);
    const input = document.querySelector(`input[value="${CSS.escape(value)}"]`);
    if (input) input.checked = false;
  } else {
    state[type] = "all";
    document.querySelector(`#${type}Filter`).value = "all";
  }
  render();
}

function resetFilters() {
  state.search = "";
  state.brands.clear();
  state.weights.clear();
  state.colors.clear();
  state.base = "all";
  state.fiber = "all";
  document.querySelector("#searchInput").value = "";
  document.querySelector("#baseFilter").value = "all";
  document.querySelector("#fiberFilter").value = "all";
  document.querySelectorAll("input[data-filter]").forEach((input) => { input.checked = false; });
  render();
}

function openYarn(id) {
  const yarn = yarns.find((item) => item.id === id);
  if (!yarn) return;
  const fiberText = yarn.fiber_content
    ? Object.entries(yarn.fiber_content).map(([fiber, amount]) => `${formatLabel(fiber)} ${amount}%`).join(", ")
    : yarn.fibers.join(", ") || t("notRecorded");
  const fallback = yarn.colorGroups.slice(0, 3).map((color) => COLOR_HEX[color]).join(", ") || "#d8d0c2, #aaa399";

  elements.dialogContent.innerHTML = `
    <div class="dialog-photo" style="--fallback: linear-gradient(135deg, ${fallback})">
      <img src="${yarn.image}" alt="${escapeHtml(`${yarn.brand} ${yarn.colorway}`)}" />
    </div>
    <div class="dialog-body">
      <p class="dialog-brand">${escapeHtml(yarn.brand)} · ${escapeHtml(yarn.base)}</p>
      <h2 id="dialogTitle">${escapeHtml(yarn.colorway)}</h2>
      <div class="dialog-tags">
        ${(yarn.mood || []).slice(0, 5).map((mood) => `<span>${escapeHtml(mood)}</span>`).join("")}
      </div>
      <dl class="detail-list">
        ${detailRow(t("inStash"), formatSkeinCount(yarn.quantity))}
        ${detailRow(t("weight"), weightLabel(yarn.weight))}
        ${detailRow(t("fiber"), fiberText)}
        ${detailRow(t("skein"), [yarn.skein_weight_g && `${yarn.skein_weight_g}g`, yarn.yardage_m && `${formatNumber(yarn.yardage_m)}m`].filter(Boolean).join(" · ") || t("notRecorded"))}
        ${detailRow(t("needles"), yarn.needle_size || t("notRecorded"))}
        ${detailRow(t("colors"), yarn.colors.join(", ") || t("notRecorded"))}
      </dl>
      ${yarn.notes ? `<div class="dialog-note"><h3>${t("stashNote")}</h3><p>${escapeHtml(yarn.notes)}</p></div>` : ""}
      ${(yarn.pattern_ideas || []).length ? `<div class="dialog-note"><h3>${t("patternIdeas")}</h3><p>${yarn.pattern_ideas.map(escapeHtml).join(" · ")}</p></div>` : ""}
    </div>`;

  const image = elements.dialogContent.querySelector("img");
  image.addEventListener("error", () => image.closest(".dialog-photo").classList.add("image-missing"), { once: true });
  elements.dialog.dataset.yarnId = id;
  if (!elements.dialog.open) elements.dialog.showModal();
}

function detailRow(label, value) {
  return `<div><dt>${label}</dt><dd>${escapeHtml(String(value))}</dd></div>`;
}

function toggleMobileFilters() {
  const open = !elements.filters.classList.contains("mobile-open");
  elements.filters.classList.toggle("mobile-open", open);
  elements.filterBackdrop.hidden = !open;
  elements.mobileFilterButton.setAttribute("aria-expanded", open);
  document.body.classList.toggle("filter-open", open);
}

function closeMobileFilters() {
  elements.filters.classList.remove("mobile-open");
  elements.filterBackdrop.hidden = true;
  elements.mobileFilterButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("filter-open");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function formatNumber(value) {
  return new Intl.NumberFormat(state.language === "ko" ? "ko-KR" : "en-US", { maximumFractionDigits: 1 }).format(value);
}

function formatSkeinCount(value) {
  const quantity = formatQuantity(value);
  if (state.language === "ko") return `${quantity}타래`;
  return `${quantity} skein${Number(value) === 1 ? "" : "s"}`;
}

function formatQuantity(value) {
  return Number.isInteger(value) ? value : Number(value).toFixed(1).replace(/\.0$/, "");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  })[character]);
}
