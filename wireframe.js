const mixes = {
  yarn: [
    { name: "Conifer Green", meta: "Echo Cashmere · Fingering", image: "./assets/images/yarn/purl-soho-echo-cashmere-conifer-green.png" },
    { name: "Antique Rose", meta: "Melted Baby Suri · Lace", image: "./assets/images/yarn/qing-fibre-melted-baby-suri-antique-rose.png" },
    { name: "Yellow Saffron", meta: "Estuary · Fingering", image: "./assets/images/yarn/purl-soho-estuary-yellow-saffron.png" },
    { name: "Somnia", meta: "Yak Single · Fingering", image: "./assets/images/yarn/qing-fibre-yak-somnia.png" },
    { name: "Galapagos Teal", meta: "Blackbird Linen · DK", image: "./assets/images/yarn/purl-soho-blackbird-linen-galapagos-teal.png" }
  ],
  pattern: [
    { name: "Joanna Hat", meta: "Hat · Intermediate", image: "./assets/images/pattern/joanna-hat.png" },
    { name: "Harlequin Shawlette", meta: "Shawl · Intermediate", image: "./assets/images/pattern/harlequin-shawlette.png" },
    { name: "Cardigan No. 4", meta: "Cardigan · Advanced", image: "./assets/images/pattern/cardigan-no-4.png?v=20260928-2" },
    { name: "Basket Bag", meta: "Bag · Intermediate", image: "./assets/images/pattern/basket-bag.png?v=20260928-3" }
  ],
  element: [
    { name: "Tulip ETIMO Red Crochet Hook Set", meta: "Crochet hooks · In use", image: "./assets/images/tools/croch-needle-set-red-tulip.png", visualLabel: "", details: { CATEGORY: "Tool", TYPE: "Crochet hooks", STATUS: "In use", CABINET: "My Items" } },
    { name: "ChiaoGoo TWIST Blue Shorties", meta: "Knitting needles · In use", image: "./assets/images/tools/knitting-needle-set-chiaogu-blue-shorty-2inch.and.3inch.png", visualLabel: "", details: { CATEGORY: "Tool", TYPE: "Knitting needles", STATUS: "In use", CABINET: "My Items" } },
    { name: "KnitPro Ginger Grande 5-inch Set", meta: "Knitting needles · In use", image: "./assets/images/tools/knitting-needle-set-ginger-3.5inch.png", visualLabel: "", details: { CATEGORY: "Tool", TYPE: "Knitting needles", STATUS: "In use", CABINET: "My Items" } },
    { name: "Clover Takumi Combo Set", meta: "Knitting needles · In use", image: "./assets/images/tools/knitting-needle-set-takumi-5inch.png", visualLabel: "", details: { CATEGORY: "Tool", TYPE: "Knitting needles", STATUS: "In use", CABINET: "My Items" } },
    { name: "Lotus Sahara 5-inch Set", meta: "Knitting needles · Loved", image: "", visualLabel: "LOTUS SAHARA", details: { CATEGORY: "Tool", TYPE: "Knitting needles", STATUS: "Loved", CABINET: "My Items" } }
  ]
};

const libraryData = Promise.all([
  fetch("./data/my-yarn-stash.json").then((response) => response.ok ? response.json() : []),
  fetch("./data/pattern-library.json").then((response) => response.ok ? response.json() : []),
  fetch("./data/shop-yarn-bases.json").then((response) => response.ok ? response.json() : [])
]).then(([yarns, patterns, yarnBases]) => ({ yarns, patterns, yarnBases })).catch(() => ({ yarns: [], patterns: [], yarnBases: [] }));

const translations = {
  ko: {
    energy: ["아주 고요한", "고요한", "균형 잡힌", "생기 있는", "아주 활기찬"],
    texture: ["몽글한", "부드러운", "담백한", "또렷한", "선명한"],
    color: ["옅은", "차분한", "중간 톤", "풍부한", "강렬한"],
    reason: (energy, texture, color) => `${energy} 에너지에 ${color} 색감과 ${texture} 조직이 예상 밖의 균형을 만들어요.`,
    saved: "저장됨",
    save: "조합 저장"
  },
  en: {
    energy: ["very still", "still", "balanced", "lively", "electric"],
    texture: ["cloudy", "soft", "plain", "defined", "crisp"],
    color: ["pale", "muted", "mid-tone", "rich", "vivid"],
    reason: (energy, texture, color) => `${energy} energy meets ${color} color and a ${texture} texture in an unexpected balance.`,
    saved: "Saved",
    save: "Save mix"
  }
};

const STORAGE_KEY = "skein-to-mood:saved-mixes";
const DEFAULT_SAVED_MIXES = [
  { id: "mix-001", title: "Powder & Air", tags: "tender · hazy · rose", primary: "./assets/images/yarn/qing-fibre-melted-baby-suri-antique-rose.png", secondary: "./assets/images/pattern/harlequin-shawlette.png", savedDate: "2026-09-28", note: "부드러운 재료와 느린 리듬이 만나는 조합. 다음 프로젝트를 위한 출발점.", connections: { yarn: "Antique Rose", pattern: "Harlequin Shawlette", element: "KnitPro Ginger Grande 5-inch Set" } },
  { id: "mix-002", title: "Night Geometry", tags: "quiet · graphic · deep", primary: "./assets/images/yarn/qing-fibre-yak-somnia.png", secondary: "./assets/images/pattern/joanna-hat.png", savedDate: "2026-09-28", note: "깊은 색과 또렷한 구조가 만나는 차분한 조합.", connections: { yarn: "Somnia", pattern: "Joanna Hat", element: "ChiaoGoo TWIST Blue Shorties" } },
  { id: "mix-003", title: "Warm Interval", tags: "sunny · tactile · slow", primary: "./assets/images/yarn/purl-soho-estuary-yellow-saffron.png", secondary: "./assets/images/pattern/basket-bag.png?v=20260928-3", savedDate: "2026-09-28", note: "따뜻한 색과 손에 잡히는 구조를 천천히 이어가는 조합.", connections: { yarn: "Yellow Saffron", pattern: "Basket Bag", element: "Clover Takumi Combo Set" } }
];

function loadSavedMixes() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : DEFAULT_SAVED_MIXES;
  } catch {
    return DEFAULT_SAVED_MIXES;
  }
}

const state = { language: window.SiteState.getLanguage(), savedMixes: loadSavedMixes() };

function persistSavedMixes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedMixes));
}

const elements = {
  energy: document.querySelector("#energyRange"),
  texture: document.querySelector("#textureRange"),
  color: document.querySelector("#colorRange"),
  energyOutput: document.querySelector("#energyOutput"),
  textureOutput: document.querySelector("#textureOutput"),
  colorOutput: document.querySelector("#colorOutput"),
  reason: document.querySelector("#mixReason"),
  save: document.querySelector("#saveMixButton")
};

function updateMood() {
  const copy = translations[state.language];
  const energy = copy.energy[Number(elements.energy.value)];
  const texture = copy.texture[Number(elements.texture.value)];
  const color = copy.color[Number(elements.color.value)];
  elements.energyOutput.textContent = energy;
  elements.textureOutput.textContent = texture;
  elements.colorOutput.textContent = color;
  elements.reason.textContent = copy.reason(energy, texture, color);
  [elements.energy, elements.texture, elements.color].forEach((input) => {
    const progress = ((Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min))) * 100;
    input.style.setProperty("--range-progress", `${progress}%`);
  });
}

function randomItem(items, currentName) {
  const choices = items.filter((item) => item.name !== currentName);
  return choices[Math.floor(Math.random() * choices.length)];
}

function updateSlot(type) {
  const slot = document.querySelector(`[data-slot="${type}"]`);
  if (slot.querySelector(".lock-button").getAttribute("aria-pressed") === "true") return;
  const name = document.querySelector(`#${type}Name`);
  const meta = document.querySelector(`#${type}Meta`);
  const image = document.querySelector(`#${type}Image`);
  const next = randomItem(mixes[type], name.textContent);
  name.textContent = next.name;
  meta.textContent = next.meta;
  if (next.image) {
    image.src = next.image;
    image.hidden = false;
  } else {
    image.removeAttribute("src");
    image.hidden = true;
  }
  image.alt = next.name;
  slot.querySelector(".slot-detail-trigger").setAttribute("aria-label", `${next.name} 상세 보기`);
  if (type === "element") {
    const visualLabel = document.querySelector("#elementVisualLabel");
    const media = visualLabel.closest(".element-media");
    visualLabel.textContent = next.visualLabel;
    visualLabel.hidden = !next.visualLabel;
    media.classList.toggle("placeholder", !next.image);
  }
}

function formatFiber(fiber = {}) {
  return Object.entries(fiber).map(([name, amount]) => `${amount}% ${name.replaceAll("_", " ")}`).join(", ") || "Not specified";
}

function formatGauge(gauge = {}) {
  if (gauge.status) return gauge.status;
  const rowCount = gauge.rows || gauge.rounds;
  const rowLabel = gauge.rows ? "rows" : "rounds";
  const counts = [gauge.stitches && `${gauge.stitches} sts`, rowCount && `${rowCount} ${rowLabel}`].filter(Boolean).join(" × ");
  return `${counts}${gauge.over ? ` / ${gauge.over}` : ""}` || "Not specified";
}

function formatOriginalYarn(yarn = {}) {
  if (yarn.lower_section) {
    const lower = [yarn.lower_section.brand, yarn.lower_section.base].filter(Boolean).join(" ");
    const upper = yarn.upper_section_options?.[0];
    return [lower, upper && [upper.brand, upper.base].filter(Boolean).join(" ")].filter(Boolean).join(" + ");
  }
  if (yarn.main_color || yarn.contrast_color) return [yarn.main_color?.base, yarn.contrast_color?.base].filter(Boolean).join(" + ");
  return [yarn.brand, yarn.base || yarn.sample_yarn || yarn.main_combination || yarn.weight].filter(Boolean).join(" ") || "Not specified";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  })[character]);
}

function detailRows(rows) {
  return Object.entries(rows).map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || "Not specified")}</dd></div>`).join("");
}

const mixItemDialog = document.querySelector("#mixItemDialog");

async function openMixItemDetail(type) {
  const { yarns, patterns, yarnBases } = await libraryData;
  const name = document.querySelector(`#${type}Name`).textContent;
  const meta = document.querySelector(`#${type}Meta`).textContent;
  const image = document.querySelector(`#${type}Image`).getAttribute("src") || "";
  let label = "TASTE";
  let rows = {};
  let note = "이 조합에 개인적인 취향과 리듬을 더하는 조각이에요.";

  if (type === "yarn") {
    const item = yarns.find((entry) => entry.colorway === name) || {};
    const base = yarnBases.find((entry) => entry.id === item.base_id) || {};
    label = "YARN";
    rows = {
      BRAND: item.brand,
      BASE: item.base,
      WEIGHT: item.weight || base.weight || meta.split(" · ").at(-1),
      FIBER: formatFiber(item.fiber_content || base.fiber_content),
      QUANTITY: item.quantity ? `${item.quantity} ${item.unit || "skein"}` : "Not specified"
    };
    note = "색과 촉감으로 패턴의 분위기를 결정하는 조합의 출발점이에요.";
  } else if (type === "pattern") {
    const item = patterns.find((entry) => entry.title === name) || {};
    label = "PATTERN";
    rows = {
      BRAND: item.brand,
      DESIGNER: item.designer,
      GAUGE: formatGauge(item.gauge),
      "ORIGINAL YARN": formatOriginalYarn(item.recommended_yarn),
      NEEDLE: item.gauge?.needle || item.tools?.[0]
    };
    note = "실의 성격을 실제 형태와 구조로 연결하는 조합의 뼈대예요.";
  } else {
    const item = mixes.element.find((entry) => entry.name === name);
    label = "TOOL";
    rows = item?.details || { CATEGORY: "Tool", TYPE: meta.split(" · ")[0], CABINET: "My Items" };
    note = "손에 익은 도구로 실과 패턴을 실제 작업으로 이어주는 조합의 실행 요소예요.";
  }

  const detailImage = document.querySelector("#mixItemImage");
  const detailVisual = detailImage.closest(".mix-item-visual");
  if (image) {
    detailImage.src = image;
    detailImage.hidden = false;
  } else {
    detailImage.removeAttribute("src");
    detailImage.hidden = true;
  }
  detailImage.alt = name;
  detailVisual.classList.toggle("placeholder", !image);
  detailVisual.dataset.placeholder = image ? "" : name;
  document.querySelector("#mixItemLabel").textContent = label;
  document.querySelector("#mixItemTitle").textContent = name;
  document.querySelector("#mixItemTags").textContent = meta;
  document.querySelector("#mixItemMeta").innerHTML = detailRows(rows);
  document.querySelector("#mixItemNote").textContent = note;
  mixItemDialog.showModal();
}

document.querySelectorAll(".slot-detail-trigger").forEach((button) => {
  button.addEventListener("click", () => openMixItemDetail(button.closest(".mix-slot").dataset.slot));
});

document.querySelector("#mixItemClose").addEventListener("click", () => mixItemDialog.close());
mixItemDialog.addEventListener("click", (event) => {
  if (event.target === mixItemDialog) mixItemDialog.close();
});

document.querySelectorAll(".lock-button").forEach((button) => {
  button.addEventListener("click", () => {
    const pressed = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!pressed));
  });
});

document.querySelectorAll(".mood-tags button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("selected");
    button.setAttribute("aria-pressed", String(button.classList.contains("selected")));
  });
});

[elements.energy, elements.texture, elements.color].forEach((input) => input.addEventListener("input", updateMood));

function generateMix() {
  ["yarn", "pattern", "element"].forEach(updateSlot);
  elements.save.classList.remove("saved");
  elements.save.textContent = translations[state.language].save;
  updateMood();
}

function updateSavedCount() {
  const count = state.savedMixes.length;
  document.querySelector("#savedCount").textContent = String(count).padStart(2, "0");
  document.querySelector("#heroSavedCount").textContent = String(count).padStart(2, "0");
  document.querySelector(".feed-count").textContent = state.language === "ko" ? `${count}개의 조합` : `${count} ${count === 1 ? "combination" : "combinations"}`;
}

function renderSavedMixes() {
  const grid = document.querySelector(".saved-grid");
  if (!state.savedMixes.length) {
    grid.innerHTML = `<div class="saved-empty">${state.language === "ko" ? "아직 저장한 믹스가 없어요." : "No saved mixes yet."}</div>`;
    updateSavedCount();
    return;
  }
  grid.innerHTML = state.savedMixes.map((mix, index) => `
    <button class="saved-item" type="button" data-detail-index="${index}">
      <div class="saved-stack"><img src="${escapeHtml(mix.primary)}" alt="${escapeHtml(mix.connections.yarn)} ${state.language === "ko" ? "실" : "yarn"}" /><img src="${escapeHtml(mix.secondary)}" alt="${escapeHtml(mix.connections.pattern)} ${state.language === "ko" ? "패턴 대표 이미지" : "pattern cover"}" /></div>
      <div><span>MIX ${String(index + 1).padStart(3, "0")}</span><h3>${escapeHtml(mix.title)}</h3><p>${escapeHtml(mix.tags)}</p></div>
    </button>`).join("");
  updateSavedCount();
}

function currentMix() {
  const yarn = document.querySelector("#yarnName").textContent;
  const pattern = document.querySelector("#patternName").textContent;
  const element = document.querySelector("#elementName").textContent;
  return {
    id: `mix-${Date.now()}`,
    title: `${yarn} × ${pattern}`,
    tags: [elements.energyOutput.textContent, elements.textureOutput.textContent, elements.colorOutput.textContent].join(" · "),
    primary: document.querySelector("#yarnImage").getAttribute("src"),
    secondary: document.querySelector("#patternImage").getAttribute("src"),
    savedDate: new Date().toISOString().slice(0, 10),
    note: elements.reason.textContent,
    connections: { yarn, pattern, element }
  };
}

document.querySelector("#luckyButton").addEventListener("click", generateMix);
document.querySelector("#heroLuckyButton").addEventListener("click", () => {
  generateMix();
  document.querySelector("#mixTitle").scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.save.addEventListener("click", () => {
  if (!elements.save.classList.contains("saved")) {
    state.savedMixes.push(currentMix());
    persistSavedMixes();
    renderSavedMixes();
  }
  elements.save.classList.add("saved");
  elements.save.textContent = translations[state.language].saved;
});

function applyLanguage(language, { persist = true } = {}) {
  state.language = language;
  if (persist) window.SiteState.setLanguage(language);
  document.documentElement.lang = language;
  document.querySelectorAll("[data-language]").forEach((item) => {
    const active = item.dataset.language === language;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-ko][data-en]").forEach((item) => {
    item.textContent = item.dataset[language];
  });
  elements.save.textContent = elements.save.classList.contains("saved") ? translations[language].saved : translations[language].save;
  updateMood();
  renderSavedMixes();
}

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});
window.addEventListener("site-language-change", (event) => applyLanguage(event.detail.language, { persist: false }));

document.querySelectorAll(".feed-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".feed-tabs button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
  });
});

const detailDialog = document.querySelector("#detailDialog");
let activeDetailIndex = 0;
let activeDetailView = "mix";
let deleteArmed = false;

function mixDetailMeta(item) {
  const savedDate = item.savedDate || "2026-09-28";
  return state.language === "ko"
    ? { "구성": "실 · 패턴 · 도구", "저장일": savedDate, "기분": item.tags }
    : { CONTENTS: "Yarn · Pattern · Tool", SAVED: savedDate, MOOD: item.tags };
}

function patternSize(pattern = {}) {
  return (pattern.sizes || []).map((size) => size.name).filter(Boolean).join(", ") || "Not specified";
}

function renderMixConnections(connections) {
  const copy = state.language === "ko"
    ? { heading: "연결된 조각", yarn: "실", pattern: "패턴", element: "도구" }
    : { heading: "Connected pieces", yarn: "Yarn", pattern: "Pattern", element: "Tool" };
  document.querySelector("#detailConnections").innerHTML = `
    <div class="detail-subheading"><span>${copy.heading}</span><b>3</b></div>
    <button type="button"><span>${copy.yarn}</span><strong id="detailYarnName">${escapeHtml(connections.yarn)}</strong></button>
    <button id="detailPatternConnection" type="button"><span>${copy.pattern}</span><strong id="detailPatternName">${escapeHtml(connections.pattern)}</strong></button>
    <button type="button"><span>${copy.element}</span><strong id="detailElementName">${escapeHtml(connections.element)}</strong></button>`;
  document.querySelector("#detailPatternConnection").addEventListener("click", openSavedPatternDetail);
}

function renderDetail(index) {
  const item = state.savedMixes[index];
  if (!item) return;
  const connections = item.connections;
  activeDetailIndex = index;
  activeDetailView = "mix";
  detailDialog.classList.remove("pattern-view");
  document.querySelector("#detailBack").hidden = true;
  document.querySelector("#detailDelete").hidden = false;
  document.querySelector("#detailPrevious").hidden = false;
  document.querySelector("#detailNext").hidden = false;
  document.querySelector("#detailLabel").textContent = `MIX ${String(index + 1).padStart(3, "0")}`;
  document.querySelector("#detailTitle").textContent = item.title;
  document.querySelector("#detailTags").textContent = item.tags;
  document.querySelector("#detailPrimaryImage").src = item.primary;
  document.querySelector("#detailPrimaryImage").alt = `${item.title} primary`;
  document.querySelector("#detailSecondaryImage").src = item.secondary;
  document.querySelector("#detailSecondaryImage").alt = `${connections.pattern} 패턴 대표 이미지`;
  document.querySelector("#detailPatternThumbnail").setAttribute("aria-label", `${connections.pattern} 패턴 상세 보기`);
  document.querySelector("#detailPatternThumbnail").title = state.language === "ko" ? "패턴 상세 보기" : "View pattern details";
  document.querySelector("#detailMeta").innerHTML = detailRows(mixDetailMeta(item));
  renderMixConnections(connections);
  document.querySelector("#detailNoteLabel").textContent = state.language === "ko" ? "메모" : "Note";
  document.querySelector("#detailNoteText").textContent = item.note;
  const deleteButton = document.querySelector("#detailDelete");
  deleteArmed = false;
  deleteButton.classList.remove("armed");
  deleteButton.textContent = state.language === "ko" ? "삭제" : "Delete";
  deleteButton.setAttribute("aria-label", state.language === "ko" ? "저장한 믹스 삭제" : "Delete saved mix");
  deleteButton.title = deleteButton.getAttribute("aria-label");
}

async function openSavedPatternDetail() {
  const { patterns } = await libraryData;
  const activeMix = state.savedMixes[activeDetailIndex];
  if (!activeMix) return;
  const patternName = activeMix.connections.pattern;
  const pattern = patterns.find((entry) => entry.title === patternName);
  if (!pattern) return;

  activeDetailView = "pattern";
  detailDialog.classList.add("pattern-view");
  document.querySelector("#detailBack").hidden = false;
  document.querySelector("#detailDelete").hidden = true;
  document.querySelector("#detailPrevious").hidden = true;
  document.querySelector("#detailNext").hidden = true;
  document.querySelector("#detailLabel").textContent = "PATTERN";
  document.querySelector("#detailTitle").textContent = pattern.title;
  document.querySelector("#detailTags").textContent = [pattern.craft, pattern.category, ...(pattern.mood_tags || []).slice(0, 3)].filter(Boolean).join(" · ");
  document.querySelector("#detailPrimaryImage").src = pattern.image?.asset_path || activeMix.secondary;
  document.querySelector("#detailPrimaryImage").alt = `${pattern.title} 패턴 대표 이미지`;
  document.querySelector("#detailSecondaryImage").src = activeMix.primary;
  document.querySelector("#detailSecondaryImage").alt = `${activeMix.connections.yarn} 실 대표 이미지`;
  document.querySelector("#detailPatternThumbnail").setAttribute("aria-label", state.language === "ko" ? "믹스 상세로 돌아가기" : "Return to mix details");
  document.querySelector("#detailPatternThumbnail").title = state.language === "ko" ? "믹스 상세로 돌아가기" : "Return to mix details";
  document.querySelector("#detailMeta").innerHTML = detailRows({
    BRAND: pattern.brand,
    DESIGNER: pattern.designer,
    GAUGE: formatGauge(pattern.gauge),
    "ORIGINAL YARN": formatOriginalYarn(pattern.recommended_yarn),
    TOOL: pattern.gauge?.needle || pattern.tools?.[0],
    SIZE: patternSize(pattern)
  });
  document.querySelector("#detailConnections").innerHTML = "";
  document.querySelector("#detailNoteLabel").textContent = state.language === "ko" ? "패턴 보관함 기록" : "Pattern cabinet note";
  document.querySelector("#detailNoteText").textContent = pattern.notes || (state.language === "ko"
    ? "전체 제작 방법은 원본 도안에서 확인하세요."
    : "Refer to the original pattern for complete instructions.");
}

function toggleSavedDetailView() {
  if (activeDetailView === "pattern") {
    renderDetail(activeDetailIndex);
    return;
  }
  openSavedPatternDetail();
}

document.querySelector(".saved-grid").addEventListener("click", (event) => {
  const item = event.target.closest(".saved-item");
  if (!item) return;
  renderDetail(Number(item.dataset.detailIndex));
  detailDialog.showModal();
});

document.querySelector("#detailPrevious").addEventListener("click", () => {
  renderDetail((activeDetailIndex - 1 + state.savedMixes.length) % state.savedMixes.length);
});

document.querySelector("#detailNext").addEventListener("click", () => {
  renderDetail((activeDetailIndex + 1) % state.savedMixes.length);
});

document.querySelector("#detailDelete").addEventListener("click", () => {
  const deleteButton = document.querySelector("#detailDelete");
  if (!deleteArmed) {
    deleteArmed = true;
    deleteButton.classList.add("armed");
    deleteButton.textContent = state.language === "ko" ? "한 번 더 눌러 삭제" : "Click again to delete";
    return;
  }
  state.savedMixes.splice(activeDetailIndex, 1);
  persistSavedMixes();
  renderSavedMixes();
  detailDialog.close();
});

document.querySelector("#detailPatternThumbnail").addEventListener("click", toggleSavedDetailView);
document.querySelector("#detailPatternConnection").addEventListener("click", openSavedPatternDetail);
document.querySelector("#detailBack").addEventListener("click", () => renderDetail(activeDetailIndex));
document.querySelector("#detailClose").addEventListener("click", () => detailDialog.close());
detailDialog.addEventListener("click", (event) => {
  if (event.target === detailDialog) detailDialog.close();
});

persistSavedMixes();
applyLanguage(state.language, { persist: false });
