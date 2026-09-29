const mixes = {
  yarn: [
    { name: "Conifer Green", meta: "Echo Cashmere · Fingering", image: "./assets/images/yarn/purl-soho-echo-cashmere-conifer-green.png" },
    { name: "Antique Rose", meta: "Melted Baby Suri · Lace", image: "./assets/images/yarn/qing-fibre-melted-baby-suri-antique-rose.png" },
    { name: "Yellow Saffron", meta: "Estuary · Fingering", image: "./assets/images/yarn/purl-soho-estuary-yellow-saffron.png" },
    { name: "Somnia", meta: "Yak Single · Fingering", image: "./assets/images/yarn/qing-fibre-yak-somnia.png" },
    { name: "Galapagos Teal", meta: "Blackbird Linen · DK", image: "./assets/images/yarn/purl-soho-blackbird-linen-galapagos-teal.png" }
  ],
  pattern: [
    { name: "Joanna Hat", meta: "Hat · Intermediate", image: "./assets/images/pattern/joanna-hat.png?v=20260928-2" },
    { name: "Harlequin Shawlette", meta: "Shawl · Intermediate", image: "./assets/images/pattern/harlequin-shawlette.png" },
    { name: "Cardigan No. 4", meta: "Cardigan · Advanced", image: "./assets/images/pattern/cardigan-no-4.png?v=20260928-2" },
    { name: "Basket Bag", meta: "Bag · Intermediate", image: "./assets/images/pattern/basket-bag.png?v=20260928-3" }
  ]
};

let libraryCache = { yarns: [], patterns: [], yarnBases: [] };
const libraryData = Promise.all([
  fetch("./data/my-yarn-stash.json").then((response) => response.ok ? response.json() : []),
  fetch("./data/pattern-library.json").then((response) => response.ok ? response.json() : []),
  fetch("./data/shop-yarn-bases.json").then((response) => response.ok ? response.json() : [])
]).then(([yarns, patterns, yarnBases]) => {
  libraryCache = { yarns, patterns, yarnBases };
  return libraryCache;
}).catch(() => libraryCache);

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
const LEGACY_SAMPLE_IDS = new Set(["mix-001", "mix-002", "mix-003"]);

function loadSavedMixes() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const saved = Array.isArray(stored) ? stored.filter((mix) => !LEGACY_SAMPLE_IDS.has(mix.id)) : [];
    return saved.map((mix) => ({
      ...mix,
      connections: {
        ...mix.connections,
        element: `${mix.connections?.yarn || "Yarn"} × ${mix.connections?.pattern || "Pattern"}`
      }
    }));
  } catch {
    return [];
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

function waitForImage(image) {
  if (image.complete && image.naturalWidth) return Promise.resolve();
  return new Promise((resolve, reject) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", reject, { once: true });
  });
}

async function updateSlot(type) {
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
  await waitForImage(image);
}

function drawCover(context, image, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawnWidth = image.naturalWidth * scale;
  const drawnHeight = image.naturalHeight * scale;
  context.drawImage(image, (width - drawnWidth) / 2, (height - drawnHeight) / 2, drawnWidth, drawnHeight);
}

function averageYarnColor(image) {
  const sample = document.createElement("canvas");
  sample.width = 48;
  sample.height = 48;
  const context = sample.getContext("2d", { willReadFrequently: true });
  const cropWidth = image.naturalWidth * .58;
  const cropHeight = image.naturalHeight * .58;
  context.drawImage(image, (image.naturalWidth - cropWidth) / 2, (image.naturalHeight - cropHeight) / 2, cropWidth, cropHeight, 0, 0, 48, 48);
  const pixels = context.getImageData(0, 0, 48, 48).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
    if (pixels[index + 3] < 200 || brightness < 22 || brightness > 242) continue;
    red += pixels[index];
    green += pixels[index + 1];
    blue += pixels[index + 2];
    count += 1;
  }
  return count ? [red / count, green / count, blue / count].map(Math.round) : [112, 102, 92];
}

function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgbToHsl(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  if (max === min) return [0, 0, lightness];
  const delta = max - min;
  const saturation = lightness > .5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = max === r ? (g - b) / delta + (g < b ? 6 : 0) : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return [hue * 60, saturation, lightness];
}

function hslToRgb(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const section = hue / 60;
  const x = chroma * (1 - Math.abs((section % 2) - 1));
  const [r1, g1, b1] = section < 1 ? [chroma, x, 0] : section < 2 ? [x, chroma, 0] : section < 3 ? [0, chroma, x] : section < 4 ? [0, x, chroma] : section < 5 ? [x, 0, chroma] : [chroma, 0, x];
  const match = lightness - chroma / 2;
  return [r1, g1, b1].map((channel) => Math.round((channel + match) * 255));
}

function hueDistance(first, second) {
  const distance = Math.abs(first - second);
  return Math.min(distance, 360 - distance);
}

function dominantGarmentHue(pixels, width, height) {
  const bins = new Array(24).fill(0);
  const xStart = Math.floor(width * .18);
  const xEnd = Math.ceil(width * .82);
  const yStart = Math.floor(height * .14);
  const yEnd = Math.ceil(height * .86);
  for (let y = yStart; y < yEnd; y += 2) {
    for (let x = xStart; x < xEnd; x += 2) {
      const index = (y * width + x) * 4;
      const [hue, saturation, lightness] = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2]);
      if (saturation < .16 || lightness < .08 || lightness > .92) continue;
      bins[Math.floor(hue / 15) % bins.length] += saturation * (1 - Math.abs(lightness - .5));
    }
  }
  const strongest = Math.max(...bins);
  return strongest > 0 ? (bins.indexOf(strongest) + .5) * 15 : null;
}

function recolorGarment(context, yarnImage, targetPalette, width, height) {
  const patternData = context.getImageData(0, 0, width, height);
  const pixels = patternData.data;
  const garmentHue = dominantGarmentHue(pixels, width, height);
  const targetColors = targetPalette.map((color) => rgbToHsl(...color));

  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = width;
  textureCanvas.height = height;
  const textureContext = textureCanvas.getContext("2d", { willReadFrequently: true });
  drawCover(textureContext, yarnImage, width, height);
  const texture = textureContext.getImageData(0, 0, width, height).data;

  for (let index = 0; index < pixels.length; index += 4) {
    const [sourceHue, sourceSaturation, sourceLightness] = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2]);
    const hueMatch = garmentHue === null ? 0 : Math.max(0, 1 - hueDistance(sourceHue, garmentHue) / 42);
    const chromaMask = Math.min(1, sourceSaturation / .32);
    const mask = hueMatch * chromaMask;
    if (mask < .06) continue;

    const textureLightness = (texture[index] + texture[index + 1] + texture[index + 2]) / 765;
    const paletteIndex = textureLightness > .62 && targetColors[1] ? 1 : textureLightness < .38 && targetColors[2] ? 2 : 0;
    const [targetHue, targetSaturation, targetLightness] = targetColors[paletteIndex];
    const texturedLightness = Math.max(.06, Math.min(.9, targetLightness + (sourceLightness - .5) * .45 + (textureLightness - .5) * .05));
    const recolored = hslToRgb(targetHue, Math.max(.24, Math.min(.72, targetSaturation * .9)), texturedLightness);
    const strength = mask * .9;
    pixels[index] = Math.round(pixels[index] * (1 - strength) + recolored[0] * strength);
    pixels[index + 1] = Math.round(pixels[index + 1] * (1 - strength) + recolored[1] * strength);
    pixels[index + 2] = Math.round(pixels[index + 2] * (1 - strength) + recolored[2] * strength);
  }
  context.putImageData(patternData, 0, 0);
}

async function renderSynthesis() {
  const yarnImage = document.querySelector("#yarnImage");
  const patternImage = document.querySelector("#patternImage");
  const canvas = document.querySelector("#resultCanvas");
  const status = document.querySelector("#resultStatus");
  status.textContent = state.language === "ko" ? "합성 중" : "Generating";

  try {
    await Promise.all([waitForImage(yarnImage), waitForImage(patternImage)]);
    const context = canvas.getContext("2d");
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);
    drawCover(context, patternImage, width, height);

    const yarnName = document.querySelector("#yarnName").textContent;
    const yarn = mixes.yarn.find((item) => item.name === yarnName);
    const yarnRecord = libraryCache.yarns.find((item) => item.colorway === yarnName);
    const targetPalette = yarnRecord?.palette_hex?.length ? yarnRecord.palette_hex.map(hexToRgb) : [averageYarnColor(yarnImage)];
    recolorGarment(context, yarnImage, targetPalette, width, height);

    const patternName = document.querySelector("#patternName").textContent;
    document.querySelector("#resultName").textContent = `${yarnName} × ${patternName}`;
    canvas.setAttribute("aria-label", `${yarnName} 색상과 재질을 ${patternName} 패턴에 합성한 결과`);
    status.textContent = "";
  } catch {
    status.textContent = state.language === "ko" ? "미리보기 실패" : "Preview unavailable";
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
  const image = type === "result"
    ? document.querySelector("#resultCanvas").toDataURL("image/jpeg", .9)
    : document.querySelector(`#${type}Image`).getAttribute("src") || "";
  let label = "RESULT";
  let rows = {};
  let note = "선택한 실의 색상과 섬유 질감을 패턴 이미지의 명암 위에 합성한 브라우저 미리보기예요.";

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
    rows = {
      YARN: document.querySelector("#yarnName").textContent,
      PATTERN: document.querySelector("#patternName").textContent,
      METHOD: state.language === "ko" ? "색상 혼합 · 재질 오버레이" : "Color blend · texture overlay"
    };
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

async function generateMix() {
  await Promise.all([updateSlot("yarn"), updateSlot("pattern")]);
  await renderSynthesis();
  elements.save.classList.remove("saved");
  elements.save.textContent = translations[state.language].save;
  updateMood();
}

function updateSavedCount() {
  const count = state.savedMixes.length;
  document.querySelector("#savedCount").textContent = String(count).padStart(2, "0");
  document.querySelector("#heroSavedCount").textContent = String(count).padStart(2, "0");
}

function renderSavedMixes() {
  const grid = document.querySelector(".saved-grid");
  if (!state.savedMixes.length) {
    grid.innerHTML = `<div class="saved-empty">${state.language === "ko" ? "아직 저장한 믹스가 없어요." : "No saved mixes yet."}</div>`;
    updateSavedCount();
    return;
  }
  grid.innerHTML = state.savedMixes.map((mix, index) => `
    <article class="saved-item">
      <button class="saved-item-open" type="button" data-detail-index="${index}">
        <div class="saved-stack"><img src="${escapeHtml(mix.result || mix.primary)}" alt="${escapeHtml(mix.title)} ${state.language === "ko" ? "합성 결과" : "result"}" /><img src="${escapeHtml(mix.secondary)}" alt="${escapeHtml(mix.connections.pattern)} ${state.language === "ko" ? "패턴 대표 이미지" : "pattern cover"}" /></div>
        <div><span>MIX ${String(index + 1).padStart(3, "0")}</span><h3>${escapeHtml(mix.title)}</h3><p>${escapeHtml(mix.tags)}</p></div>
      </button>
      <button class="saved-item-delete" type="button" data-delete-index="${index}" aria-label="${state.language === "ko" ? "저장한 믹스 삭제" : "Delete saved mix"}" title="${state.language === "ko" ? "삭제" : "Delete"}">×</button>
    </article>`).join("");
  updateSavedCount();
}

function currentMix() {
  const yarn = document.querySelector("#yarnName").textContent;
  const pattern = document.querySelector("#patternName").textContent;
  const element = document.querySelector("#resultName").textContent;
  const primary = document.querySelector("#yarnImage").getAttribute("src");
  let result = primary;
  try {
    result = document.querySelector("#resultCanvas").toDataURL("image/jpeg", .9);
  } catch (error) {
    console.warn("Could not serialize the synthesis preview", error);
  }
  return {
    id: `mix-${Date.now()}`,
    title: `${yarn} × ${pattern}`,
    tags: [elements.energyOutput.textContent, elements.textureOutput.textContent, elements.colorOutput.textContent].join(" · "),
    primary,
    secondary: document.querySelector("#patternImage").getAttribute("src"),
    result,
    savedDate: new Date().toISOString().slice(0, 10),
    note: elements.reason.textContent,
    connections: { yarn, pattern, element }
  };
}

document.querySelector("#generateButton").addEventListener("click", generateMix);

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
  updateCheckinDate();
  updateMood();
  renderSavedMixes();
}

function updateCheckinDate() {
  const date = new Date();
  const weekendExcitement = [0, 5, 6].includes(date.getDay());
  const label = state.language === "ko"
    ? `${weekendExcitement ? "두근두근 · " : ""}${new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "long" }).format(date)}`
    : `${weekendExcitement ? "HEART-FLUTTERING · " : ""}${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", weekday: "long" }).format(date)}`;
  const dateElement = document.querySelector("#checkinDate");
  dateElement.dateTime = date.toISOString().slice(0, 10);
  dateElement.textContent = label;
}

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});
window.addEventListener("site-language-change", (event) => applyLanguage(event.detail.language, { persist: false }));


const detailDialog = document.querySelector("#detailDialog");
let activeDetailIndex = 0;
let activeDetailView = "mix";
let deleteArmed = false;

function mixDetailMeta(item) {
  const savedDate = item.savedDate || "2026-09-28";
  return state.language === "ko"
    ? { "구성": "실 · 패턴 · 합성 결과", "저장일": savedDate, "기분": item.tags }
    : { CONTENTS: "Yarn · Pattern · Result", SAVED: savedDate, MOOD: item.tags };
}

function patternSize(pattern = {}) {
  return (pattern.sizes || []).map((size) => size.name).filter(Boolean).join(", ") || "Not specified";
}

function renderMixConnections(connections) {
  const copy = state.language === "ko"
    ? { heading: "연결된 조각", yarn: "실", pattern: "패턴", element: "합성 결과" }
    : { heading: "Connected pieces", yarn: "Yarn", pattern: "Pattern", element: "Result" };
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
  document.querySelector("#detailPrimaryImage").src = item.result || item.primary;
  document.querySelector("#detailPrimaryImage").alt = `${item.title} ${state.language === "ko" ? "합성 결과" : "result"}`;
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
  const deleteButton = event.target.closest(".saved-item-delete");
  if (deleteButton) {
    state.savedMixes.splice(Number(deleteButton.dataset.deleteIndex), 1);
    persistSavedMixes();
    renderSavedMixes();
    elements.save.classList.remove("saved");
    elements.save.textContent = translations[state.language].save;
    return;
  }
  const item = event.target.closest(".saved-item-open");
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
libraryData.finally(renderSynthesis);
