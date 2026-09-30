import { buildRecommendations } from "./recommendation-engine.js?v=20260930-6";

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
  fetch("./data/pattern-library.json?v=20260930-5").then((response) => response.ok ? response.json() : []),
  fetch("./data/shop-yarn-bases.json").then((response) => response.ok ? response.json() : []),
  fetch("./data/pattern-color-themes.json?v=20260929-3").then((response) => response.ok ? response.json() : {})
]).then(([yarns, patterns, yarnBases, colorThemes]) => {
  patterns = patterns.map((pattern) => ({ ...pattern, color_themes: colorThemes[pattern.id] || {} }));
  libraryCache = { yarns, patterns, yarnBases };
  return libraryCache;
}).catch(() => libraryCache);

const translations = {
  ko: {
    filterReady: "굵기, 합사 구성, 바늘과 보유량이 맞는 조합만 골라요.",
    saved: "저장됨",
    save: "조합 저장"
  },
  en: {
    filterReady: "Only combinations that match construction, gauge, tools, and quantity.",
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

const state = {
  language: window.SiteState.getLanguage(),
  savedMixes: loadSavedMixes(),
  currentRecommendation: null
};

function persistSavedMixes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedMixes));
}

const elements = {
  craft: document.querySelector("#craftFilter"),
  item: document.querySelector("#itemFilter"),
  needle: document.querySelector("#needleFilter"),
  stashOnly: document.querySelector("#stashOnlyFilter"),
  reason: document.querySelector("#mixReason"),
  save: document.querySelector("#saveMixButton")
};

function selectedText(select) {
  return select.options[select.selectedIndex]?.textContent || "";
}

function recommendationItemGroup(recommendation) {
  const category = String(recommendation.pattern?.category || "").toLowerCase();
  if (["hat", "headband", "socks", "scarf", "shawl"].includes(category)) return "accessory";
  if (["cardigan", "sweater", "top", "vest"].includes(category)) return "garment";
  if (["bag", "blanket", "toy", "home"].includes(category)) return "home";
  return "other";
}

function updateFilters() {
  if (!state.currentRecommendation) elements.reason.textContent = translations[state.language].filterReady;
}

function waitForImage(image) {
  if (image.classList.contains("is-placeholder")) return Promise.resolve();
  if (image.complete && image.naturalWidth) return Promise.resolve();
  return new Promise((resolve, reject) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", reject, { once: true });
  });
}

function yarnAsset(yarn) {
  const overrides = {
    "purl-soho-cashmere-merino-bloom-wheat-flour": "purl-soho-cashmere-merino-bloom.png"
  };
  return `./assets/images/yarn/${overrides[yarn.id] || `${yarn.id}.png`}`;
}

function yarnPalette(yarn) {
  const colors = (yarn.palette_hex || []).filter((color) => /^#[0-9a-f]{6}$/i.test(color));
  return colors.length ? colors : ["#8f887d", "#c8c0b4"];
}

function yarnPaletteBackground(yarn) {
  const colors = yarnPalette(yarn);
  const stops = colors.map((color, index) => `${color} ${Math.round(index / Math.max(1, colors.length - 1) * 100)}%`);
  return `linear-gradient(135deg, ${stops.join(", ")})`;
}

const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function showYarnPlaceholder(image, yarn) {
  image.src = TRANSPARENT_PIXEL;
  image.alt = "";
  image.classList.add("is-placeholder");
  image.dataset.palette = JSON.stringify(yarnPalette(yarn));
  image.style.background = yarnPaletteBackground(yarn);
}

async function loadYarnImage(image, yarn) {
  image.classList.remove("is-placeholder");
  image.style.removeProperty("background");
  image.dataset.palette = JSON.stringify(yarnPalette(yarn));
  image.alt = `${yarn.colorway} 실`;
  image.src = yarnAsset(yarn);
  try {
    if (typeof image.decode === "function") await image.decode();
    else await waitForImage(image);
    if (!image.naturalWidth) throw new Error("Yarn image is unavailable");
  } catch {
    showYarnPlaceholder(image, yarn);
  }
}

async function loadPatternImage(image, pattern) {
  image.src = pattern.image?.asset_path || "";
  image.alt = `${pattern.title} 패턴 대표 이미지`;
  if (typeof image.decode === "function") await image.decode();
  else await waitForImage(image);
}

function matchLabel(recommendation) {
  const labels = state.language === "ko"
    ? { single: "1합 호환", held_together: "합사 호환", sectioned: "구역별 조합", "double-same": "동일 실 2합", "double-mixed": "서로 다른 실 2합" }
    : { single: "Single strand", held_together: "Held together", sectioned: "Sectioned combination", "double-same": "Two strands, same yarn", "double-mixed": "Two yarns held together" };
  return labels[recommendation.match] || recommendation.match;
}

function confidenceLabel(recommendation) {
  if (recommendation.confidence === "high") return state.language === "ko" ? "높은 신뢰도 · 스와치 권장" : "High confidence · swatch recommended";
  return state.language === "ko" ? "예상 호환 · 스와치 필수" : "Likely match · swatch required";
}

function scoreNumber(value) {
  return Number(value || 0).toFixed(1).replace(/\.0$/, "");
}

function meterNumber(value) {
  return Number.isFinite(value) ? `${Math.round(value)} m` : (state.language === "ko" ? "정보 없음" : "Unknown");
}

function renderRecommendationReason(recommendation) {
  const diagnostics = recommendation.diagnostics || {};
  const ko = state.language === "ko";
  const displayYarns = recommendation.paletteYarns || recommendation.yarns;
  const isColorPalette = displayYarns.length > recommendation.yarns.length;
  const construction = displayYarns.map((yarn, index) => {
    const role = ko ? (index === 0 ? "메인색" : `대조색 ${index}`) : (index === 0 ? "Main color" : `Contrast ${index}`);
    return `${role} ${yarn.colorway}`;
  }).join(" + ");
  const weightNames = recommendation.yarns.map((yarn, index) => {
    const weight = diagnostics.yarnWeightLabels?.[index] || yarn.weight || (ko ? "굵기 정보 없음" : "Weight unavailable");
    const rank = scoreNumber(diagnostics.yarnRanks?.[index]);
    return ko ? `${weight} · 지수 ${rank}` : `${weight} · index ${rank}`;
  }).join(" + ");
  const needleRanges = (diagnostics.needleRanges || []).filter(Boolean).map((range) => `${scoreNumber(range.min)}–${scoreNumber(range.max)} mm`).join(" / ");
  const available = (diagnostics.availabilityMeters || []).map(meterNumber).join(" + ");
  const availableGrams = (diagnostics.availabilityGrams || []).map((value) => Number.isFinite(value) ? `${Math.round(value)} g` : (ko ? "정보 없음" : "Unknown")).join(" + ");
  const quantityKo = diagnostics.requiredMeters
    ? diagnostics.quantityMode === "pooled-colors"
      ? `전체 색상 합계 ${meterNumber(diagnostics.requiredMeters)} 필요 / 팔레트 보유 ${available}`
      : `최소 ${meterNumber(diagnostics.requiredMeters)}씩 필요 / 보유 ${available}`
    : diagnostics.requiredGrams
      ? `최소 ${Math.round(diagnostics.requiredGrams)} g 필요 / 보유 ${availableGrams}`
      : `패턴 최소 소요량 정보 없음 · 점수 미반영 / 보유 ${available}`;
  const quantityEn = diagnostics.requiredMeters
    ? diagnostics.quantityMode === "pooled-colors"
      ? `Total ${meterNumber(diagnostics.requiredMeters)} across colors / palette stash ${available}`
      : `Minimum ${meterNumber(diagnostics.requiredMeters)} each / stash ${available}`
    : diagnostics.requiredGrams
      ? `Minimum ${Math.round(diagnostics.requiredGrams)} g / stash ${availableGrams}`
      : `Pattern minimum unavailable · not scored / stash ${available}`;
  const rows = ko ? [
    ["굵기 적합", `${weightNames} → 환산 지수 ${scoreNumber(diagnostics.actualRank)} / 패턴 목표 지수 ${scoreNumber(diagnostics.targetRank)} / 차이 ${scoreNumber(recommendation.gaugeDifference)} (허용 ≤ 0.80)`, diagnostics.weightScore, 40],
    ["바늘 적합", diagnostics.targetNeedle ? `패턴 ${scoreNumber(diagnostics.targetNeedle)} mm / 확인 가능한 실 범위 ${needleRanges || "정보 없음"} / ${diagnostics.matchingNeedleCount || 0}개 실 확인` : "패턴 바늘 정보 없음 · 스와치 필수", diagnostics.needleScore, 20],
    ["보유량", quantityKo, diagnostics.quantityScore, 15]
  ] : [
    ["Weight fit", `${weightNames} → combined index ${scoreNumber(diagnostics.actualRank)} / pattern target ${scoreNumber(diagnostics.targetRank)} / Δ ${scoreNumber(recommendation.gaugeDifference)} (pass ≤ 0.80)`, diagnostics.weightScore, 40],
    ["Needle fit", diagnostics.targetNeedle ? `Pattern ${scoreNumber(diagnostics.targetNeedle)} mm / known yarn range ${needleRanges || "unknown"} / ${diagnostics.matchingNeedleCount || 0} yarn(s) confirmed` : "Pattern needle unavailable · swatch required", diagnostics.needleScore, 20],
    ["Quantity", quantityEn, diagnostics.quantityScore, 15]
  ];
  const constructionSummary = `${construction} · ${isColorPalette ? (ko ? `${displayYarns.length}색을 구역별로 사용` : `${displayYarns.length} colors used by section`) : matchLabel(recommendation)}`;
  elements.reason.innerHTML = `
    <div class="mix-score">
      <div>
        <strong>${scoreNumber(diagnostics.totalScore)} <small>/ ${diagnostics.maxTotalScore || 100}</small></strong>
        <small class="score-conversion-note">${ko ? `호환성 ${scoreNumber(diagnostics.compatibilityScore)} / ${diagnostics.maxCompatibilityScore || 75}를 100점 기준으로 환산한 점수` : `Compatibility ${scoreNumber(diagnostics.compatibilityScore)} / ${diagnostics.maxCompatibilityScore || 75}, converted to a 100-point score`}</small>
      </div>
      <span>${confidenceLabel(recommendation)}</span>
    </div>
    <div class="score-breakdown">
      <p>${escapeHtml(constructionSummary)}</p>
      <table>
        <tbody>${rows.map(([label, value, score, max]) => `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td><td><strong>${scoreNumber(score)}</strong> / ${max}</td></tr>`).join("")}</tbody>
        <tfoot><tr><th scope="row" colspan="2">${ko ? "호환성 합계" : "Compatibility total"}</th><td><strong>${scoreNumber(diagnostics.compatibilityScore)}</strong> / ${diagnostics.maxCompatibilityScore || 75}</td></tr></tfoot>
      </table>
    </div>`;
}

function refreshRecommendationCopy() {
  const recommendation = state.currentRecommendation;
  if (!recommendation) return;
  const displayYarns = recommendation.paletteYarns || recommendation.yarns;
  const yarnBases = displayYarns.map((yarn) => yarn.base || yarn.brand).filter(Boolean).join(" + ");
  document.querySelector("#yarnMeta").textContent = `${yarnBases} · ${matchLabel(recommendation)}`;
  document.querySelector("#resultMeta").textContent = `${matchLabel(recommendation)} · ${confidenceLabel(recommendation)}`;
  renderRecommendationReason(recommendation);
}

async function applyRecommendation(recommendation) {
  state.currentRecommendation = recommendation;
  const displayYarns = recommendation.paletteYarns || recommendation.yarns;
  const yarnName = displayYarns.map((yarn) => yarn.colorway).join(" + ");
  const yarnBases = displayYarns.map((yarn) => yarn.base || yarn.brand).filter(Boolean).join(" + ");
  const primaryImage = document.querySelector("#yarnImage");
  const secondaryImage = document.querySelector("#yarnImageSecondary");
  const imageLoads = [];
  document.querySelectorAll(".yarn-media .palette-yarn").forEach((image) => image.remove());
  document.querySelector("#yarnName").textContent = yarnName;
  document.querySelector("#yarnMeta").textContent = `${yarnBases} · ${matchLabel(recommendation)}`;
  imageLoads.push(loadYarnImage(primaryImage, recommendation.yarns[0]));
  if (displayYarns.length > 1) {
    secondaryImage.style.setProperty("--palette-index", "0");
    secondaryImage.hidden = false;
    imageLoads.push(loadYarnImage(secondaryImage, displayYarns[1]));
  } else {
    secondaryImage.removeAttribute("src");
    secondaryImage.alt = "";
    secondaryImage.hidden = true;
  }
  displayYarns.slice(2).forEach((yarn, index) => {
    const image = document.createElement("img");
    image.className = "secondary-yarn palette-yarn";
    image.style.setProperty("--palette-index", String(index + 1));
    primaryImage.parentElement.append(image);
    imageLoads.push(loadYarnImage(image, yarn));
  });

  const pattern = recommendation.pattern;
  const patternImage = document.querySelector("#patternImage");
  document.querySelector("#patternName").textContent = pattern.title;
  document.querySelector("#patternMeta").textContent = [pattern.category, pattern.difficulty].filter(Boolean).join(" · ");
  const patternLoad = loadPatternImage(patternImage, pattern);
  document.querySelector("#resultName").textContent = `${yarnName} × ${pattern.title}`;
  document.querySelector("#resultMeta").textContent = `${matchLabel(recommendation)} · ${confidenceLabel(recommendation)}`;
  await Promise.all([patternLoad, ...imageLoads]);
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

function recolorGarment(context, targetPalette, width, height) {
  const patternData = context.getImageData(0, 0, width, height);
  const pixels = patternData.data;
  const garmentHue = dominantGarmentHue(pixels, width, height);
  const [targetHue, targetSaturation, targetLightness] = rgbToHsl(...targetPalette[0]);
  let mask = new Float32Array(width * height);
  let sourceLightnessTotal = 0;
  let sourceLightnessWeight = 0;

  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    const index = pixel * 4;
    const [sourceHue, sourceSaturation, sourceLightness] = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2]);
    const hueMatch = garmentHue === null ? 0 : Math.max(0, 1 - hueDistance(sourceHue, garmentHue) / 42);
    const chromaMask = Math.min(1, sourceSaturation / .32);
    mask[pixel] = hueMatch * chromaMask;
    if (mask[pixel] > .18) {
      sourceLightnessTotal += sourceLightness * mask[pixel];
      sourceLightnessWeight += mask[pixel];
    }
  }

  for (let pass = 0; pass < 2; pass += 1) {
    const expanded = new Float32Array(mask);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const pixel = y * width + x;
        expanded[pixel] = Math.max(mask[pixel], mask[pixel - 1] * .82, mask[pixel + 1] * .82, mask[pixel - width] * .82, mask[pixel + width] * .82);
      }
    }
    mask = expanded;
  }

  const averageSourceLightness = sourceLightnessWeight ? sourceLightnessTotal / sourceLightnessWeight : .5;
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    const strength = mask[pixel] * .94;
    if (strength < .08) continue;
    const index = pixel * 4;
    const [, , sourceLightness] = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2]);
    const recoloredLightness = Math.max(.045, Math.min(.82, targetLightness + (sourceLightness - averageSourceLightness) * .58));
    const recolored = hslToRgb(targetHue, targetSaturation, recoloredLightness);
    pixels[index] = Math.round(pixels[index] * (1 - strength) + recolored[0] * strength);
    pixels[index + 1] = Math.round(pixels[index + 1] * (1 - strength) + recolored[1] * strength);
    pixels[index + 2] = Math.round(pixels[index + 2] * (1 - strength) + recolored[2] * strength);
  }
  context.putImageData(patternData, 0, 0);
}

function drawImageCoverRect(context, image, x, y, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawnWidth = image.naturalWidth * scale;
  const drawnHeight = image.naturalHeight * scale;
  context.drawImage(image, x + (width - drawnWidth) / 2, y + (height - drawnHeight) / 2, drawnWidth, drawnHeight);
}

function drawYarnCircle(context, image, centerX, centerY, radius) {
  context.save();
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.clip();
  if (image.classList.contains("is-placeholder") || !image.naturalWidth) {
    const colors = JSON.parse(image.dataset.palette || '["#8f887d","#c8c0b4"]');
    const gradient = context.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    colors.forEach((color, index) => gradient.addColorStop(index / Math.max(1, colors.length - 1), color));
    context.fillStyle = gradient;
    context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  } else {
    drawImageCoverRect(context, image, centerX - radius, centerY - radius, radius * 2, radius * 2);
  }
  context.restore();
  context.strokeStyle = "rgba(255,255,255,.92)";
  context.lineWidth = 6;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.stroke();
}

async function renderRecommendationBoard() {
  const yarnImage = document.querySelector("#yarnImage");
  const patternImage = document.querySelector("#patternImage");
  const canvas = document.querySelector("#resultCanvas");
  const status = document.querySelector("#resultStatus");
  status.textContent = state.language === "ko" ? "추천 구성 중" : "Building recommendation";

  try {
    const yarnImages = [yarnImage, ...document.querySelectorAll(".yarn-media .secondary-yarn:not([hidden])")];
    await Promise.all([waitForImage(patternImage), ...yarnImages.map(waitForImage)]);
    const context = canvas.getContext("2d");
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);
    drawCover(context, patternImage, width, height);
    const recommendation = state.currentRecommendation;
    const yarns = recommendation?.paletteYarns || recommendation?.yarns || [];
    const radius = Math.round(width * (yarnImages.length > 3 ? .065 : yarnImages.length > 2 ? .09 : .13));
    const firstX = width - radius - 28;
    const circleY = height - radius - 34;
    yarnImages.forEach((image, index) => drawYarnCircle(context, image, firstX - index * radius * 1.72, circleY, radius));

    const palette = yarns.flatMap((yarn) => yarn.palette_hex || []).slice(0, 5);
    palette.forEach((color, index) => {
      const swatchRadius = 18;
      const x = 28 + swatchRadius + index * 48;
      const y = height - 30 - swatchRadius;
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, swatchRadius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(255,255,255,.9)";
      context.lineWidth = 3;
      context.stroke();
    });

    const yarnName = document.querySelector("#yarnName").textContent;
    const patternName = document.querySelector("#patternName").textContent;
    document.querySelector("#resultName").textContent = `${yarnName} × ${patternName}`;
    canvas.setAttribute("aria-label", `${patternName} 원본 이미지와 ${yarnName} 추천 실 조합 보드`);
    const badge = document.querySelector(".result-badge");
    badge.textContent = state.language === "ko" ? "호환 추천" : "Compatible";
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
  const gaugeText = `${counts}${gauge.over ? ` / ${gauge.over}` : ""}`;
  return [gaugeText, gauge.reference_note].filter(Boolean).join(" · ") || "Not specified";
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

function colorThemeRows(themes = {}) {
  const rows = [
    [state.language === "ko" ? "원작 컬러 테마" : "ORIGINAL COLOR THEME", themes.original],
    [state.language === "ko" ? "추천 컬러 테마" : "RECOMMENDED COLOR THEME", themes.recommended]
  ];
  return rows.map(([label, colors = []]) => `<div class="color-theme-row"><dt>${label}</dt><dd><span class="color-theme">${colors.map((color) => {
    const name = state.language === "ko" ? color.name_ko || color.name : color.name;
    return `<span class="color-theme-chip"><i style="--swatch:${escapeHtml(color.hex)}" aria-hidden="true"></i>${escapeHtml(name)}</span>`;
  }).join("") || escapeHtml(state.language === "ko" ? "정보 미등록" : "Not specified")}</span></dd></div>`).join("");
}

function detailLinkRow(label, url, text) {
  if (!url) return "";
  return `<div><dt>${escapeHtml(label)}</dt><dd><a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(text)} ↗</a></dd></div>`;
}

function yarnSkeinDetail(yarn = {}, base = {}) {
  const weight = yarn.skein_weight_g || yarn.mini_skein_weight_g || base.skein_weight_g || base.default_skein_weight_g;
  const length = yarn.yardage_m || yarn.estimated_yardage_m || base.yardage_m || base.length_m;
  return [weight && `${weight} g`, length && `${Math.round(length)} m`].filter(Boolean).join(" · ") || "Not specified";
}

function yarnNeedleDetail(yarn = {}, base = {}) {
  const value = yarn.needle_size || base.needle_size || base.recommended_needle_mm;
  if (Array.isArray(value)) return `${value.join("–")} mm`;
  if (value && typeof value === "object") return `${value.min}–${value.max} mm`;
  return value || "Not specified";
}

const mixItemDialog = document.querySelector("#mixItemDialog");

async function openMixItemDetail(type, options = {}) {
  const { yarns, patterns, yarnBases } = await libraryData;
  const name = document.querySelector(`#${type}Name`).textContent;
  const meta = document.querySelector(`#${type}Meta`).textContent;
  let image = type === "result"
    ? document.querySelector("#resultCanvas").toDataURL("image/jpeg", .9)
    : document.querySelector(`#${type}Image`).getAttribute("src") || "";
  let label = "RESULT";
  let tags = meta;
  let metaMarkup = "";
  let secondaryImage = "";
  let selectedYarns = [];
  let renderYarnPopup = null;

  if (type === "yarn") {
    selectedYarns = state.currentRecommendation?.paletteYarns || state.currentRecommendation?.yarns || [yarns.find((entry) => entry.colorway === name)].filter(Boolean);
    label = state.language === "ko" ? "실 조합" : "YARN COMBINATION";
    tags = [state.currentRecommendation && matchLabel(state.currentRecommendation), ...selectedYarns.flatMap((entry) => entry.mood || []).slice(0, 4)].filter(Boolean).join(" · ");
    const yarnMetaMarkup = (item, index) => {
      const base = yarnBases.find((entry) => entry.id === item.base_id || entry.base === item.base || entry.base_name === item.base) || {};
      const fiberSource = item.fiber_content || base.fiber_content;
      const fiber = fiberSource
        ? formatFiber(fiberSource)
        : [...(item.fibers || []), ...(base.fibres || [])].map((entry) => typeof entry === "string" ? entry : entry.fibre).filter(Boolean).join(", ") || "Not specified";
      const colors = item.color_family || item.colors || [];
      const sourceUrl = item.source?.url || base.source_url || base.collection_urls?.product;
      const role = state.language === "ko" ? (index === 0 ? "메인 실" : `서브 실 ${index}`) : (index === 0 ? "MAIN YARN" : `COMPANION YARN ${index}`);
      const rows = state.language === "ko" ? {
        "브랜드 · 베이스": [item.brand, item.base || base.base || base.base_name].filter(Boolean).join(" · "),
        "굵기": item.weight || base.weight,
        "섬유": fiber,
        "보유량": `${item.quantity || "?"} ${item.unit || "skein"}`,
        "한 볼": yarnSkeinDetail(item, base),
        "권장 바늘": yarnNeedleDetail(item, base),
        "컬러군": colors.join(" · ")
      } : {
        "BRAND · BASE": [item.brand, item.base || base.base || base.base_name].filter(Boolean).join(" · "),
        WEIGHT: item.weight || base.weight,
        FIBER: fiber,
        "IN STASH": `${item.quantity || "?"} ${item.unit || "skein"}`,
        SKEIN: yarnSkeinDetail(item, base),
        NEEDLES: yarnNeedleDetail(item, base),
        COLORS: colors.join(" · ")
      };
      return `<div class="detail-group-heading"><dt>${role}</dt><dd>${escapeHtml(item.colorway)}</dd></div>${detailRows(rows)}${detailLinkRow(state.language === "ko" ? "출처" : "SOURCE", sourceUrl, state.language === "ko" ? "공식 실 페이지" : "Official yarn page")}`;
    };
    metaMarkup = selectedYarns[0] ? yarnMetaMarkup(selectedYarns[0], 0) : "";
    renderYarnPopup = (index) => {
      const item = selectedYarns[index];
      if (!item) return;
      const role = state.language === "ko" ? (index === 0 ? "메인 실" : `서브 실 ${index}`) : (index === 0 ? "MAIN YARN" : `COMPANION YARN ${index}`);
      const activeImage = document.querySelector("#mixItemImage");
      activeImage.alt = `${item.colorway} ${role}`;
      loadYarnImage(activeImage, item);
      document.querySelector("#mixItemTitle").textContent = item.colorway;
      document.querySelector("#mixItemLabel").textContent = role;
      document.querySelector("#mixItemTags").textContent = [state.currentRecommendation && matchLabel(state.currentRecommendation), ...(item.mood || []).slice(0, 4)].filter(Boolean).join(" · ");
      document.querySelector("#mixItemMeta").innerHTML = yarnMetaMarkup(item, index);
      document.querySelectorAll(".mix-item-thumbnail").forEach((button, buttonIndex) => button.setAttribute("aria-pressed", String(buttonIndex === index)));
    };
  } else if (type === "pattern") {
    const item = patterns.find((entry) => entry.title === name) || {};
    label = "PATTERN";
    tags = [item.craft, item.category, ...(item.mood_tags || []).slice(0, 4)].filter(Boolean).join(" · ");
    const rows = state.language === "ko" ? {
      "브랜드": item.brand,
      "디자이너": item.designer,
      "기법 · 유형": [item.craft, item.category].filter(Boolean).join(" · "),
      "게이지": formatGauge(item.gauge),
      "원작실": formatOriginalYarn(item.recommended_yarn),
      "바늘 · 도구": item.gauge?.needle || (item.tools || []).join(" · "),
      "사이즈": patternSize(item)
    } : {
      BRAND: item.brand,
      DESIGNER: item.designer,
      "CRAFT · TYPE": [item.craft, item.category].filter(Boolean).join(" · "),
      GAUGE: formatGauge(item.gauge),
      "ORIGINAL YARN": formatOriginalYarn(item.recommended_yarn),
      "NEEDLE · TOOLS": item.gauge?.needle || (item.tools || []).join(" · "),
      SIZE: patternSize(item)
    };
    const sourceUrl = item.pattern_access?.purchase_url || item.pattern_access?.url || item.pattern_access?.source_url;
    metaMarkup = detailRows(rows) + colorThemeRows(item.color_themes) + detailLinkRow(state.language === "ko" ? "원작 패턴" : "SOURCE", sourceUrl, state.language === "ko" ? "원작 패턴 페이지" : "Original pattern page");
  } else {
    const recommendation = state.currentRecommendation;
    metaMarkup = detailRows({
      YARN: document.querySelector("#yarnName").textContent,
      PATTERN: document.querySelector("#patternName").textContent,
      METHOD: recommendation ? matchLabel(recommendation) : "Not calculated",
      CONFIDENCE: recommendation ? confidenceLabel(recommendation) : "Not calculated"
    });
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
  const detailSecondaryImage = document.querySelector("#mixItemSecondaryImage");
  if (secondaryImage) {
    detailSecondaryImage.src = secondaryImage;
    detailSecondaryImage.alt = `${name} ${state.language === "ko" ? "서브 실" : "companion yarn"}`;
    detailSecondaryImage.hidden = false;
  } else {
    detailSecondaryImage.removeAttribute("src");
    detailSecondaryImage.alt = "";
    detailSecondaryImage.hidden = true;
  }
  detailVisual.classList.toggle("placeholder", !image);
  detailVisual.dataset.placeholder = image ? "" : name;
  document.querySelector("#mixItemLabel").textContent = label;
  document.querySelector("#mixItemTitle").textContent = name;
  document.querySelector("#mixItemTags").textContent = tags;
  document.querySelector("#mixItemMeta").innerHTML = metaMarkup;
  const tabs = document.querySelector("#mixItemTabs");
  const tabbed = options.tabbed || type === "result";
  if (tabbed) {
    const tabLabels = state.language === "ko"
      ? { result: "추천", yarn: "실", pattern: "패턴" }
      : { result: "Recommendation", yarn: "Yarn", pattern: "Pattern" };
    tabs.innerHTML = ["result", "yarn", "pattern"].map((tabType) => `
      <button type="button" role="tab" data-detail-tab="${tabType}" aria-selected="${tabType === type}">${tabLabels[tabType]}</button>
    `).join("");
    tabs.hidden = false;
    tabs.querySelectorAll("[data-detail-tab]").forEach((button) => {
      button.addEventListener("click", () => openMixItemDetail(button.dataset.detailTab, { tabbed: true }));
    });
  } else {
    tabs.innerHTML = "";
    tabs.hidden = true;
  }
  const thumbnails = document.querySelector("#mixItemThumbnails");
  if (type === "yarn" && selectedYarns.length) {
    thumbnails.innerHTML = selectedYarns.map((item, index) => `<button class="mix-item-thumbnail" type="button" aria-label="${escapeHtml(item.colorway)} ${state.language === "ko" ? "정보 보기" : "details"}" aria-pressed="${index === 0}"><img src="${yarnAsset(item)}" alt="" /></button>`).join("");
    thumbnails.hidden = false;
    thumbnails.querySelectorAll(".mix-item-thumbnail").forEach((button, index) => {
      loadYarnImage(button.querySelector("img"), selectedYarns[index]);
      button.addEventListener("click", () => renderYarnPopup(index));
    });
    renderYarnPopup(0);
  } else {
    thumbnails.innerHTML = "";
    thumbnails.hidden = true;
  }
  if (!mixItemDialog.open) mixItemDialog.showModal();
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

[elements.craft, elements.item, elements.needle, elements.stashOnly].forEach((input) => input.addEventListener("change", updateFilters));

async function generateMix() {
  const { yarns, patterns, yarnBases } = await libraryData;
  const preferences = {
    craft: elements.craft.value,
    itemGroup: elements.item.value,
    needleMm: elements.needle.value === "all" ? null : Number(elements.needle.value),
    requireQuantity: elements.stashOnly.checked
  };
  let recommendations = buildRecommendations({ yarns, patterns, yarnBases, preferences });
  const yarnLocked = document.querySelector('[data-slot="yarn"] .lock-button').getAttribute("aria-pressed") === "true";
  const patternLocked = document.querySelector('[data-slot="pattern"] .lock-button').getAttribute("aria-pressed") === "true";
  if (yarnLocked) {
    const lockedYarns = document.querySelector("#yarnName").textContent.split(" + ");
    recommendations = recommendations.filter((item) => (item.paletteYarns || item.yarns).map((yarn) => yarn.colorway).join(" + ") === lockedYarns.join(" + "));
  }
  if (patternLocked) {
    const lockedPattern = document.querySelector("#patternName").textContent;
    recommendations = recommendations.filter((item) => item.pattern.title === lockedPattern);
  }
  if (!recommendations.length) {
    document.querySelector("#resultStatus").textContent = state.language === "ko"
      ? "조건에 맞는 호환 조합이 없어요"
      : "No compatible match for these criteria";
    return;
  }
  const currentTitle = state.currentRecommendation
    ? `${state.currentRecommendation.yarns.map((yarn) => yarn.colorway).join(" + ")} × ${state.currentRecommendation.pattern.title}`
    : "";
  const alternatives = recommendations.filter((item) => `${item.yarns.map((yarn) => yarn.colorway).join(" + ")} × ${item.pattern.title}` !== currentTitle);
  let candidatePool = alternatives.length ? alternatives : recommendations;
  if (!patternLocked && state.currentRecommendation) {
    const differentPatterns = candidatePool.filter((item) => item.pattern.id !== state.currentRecommendation.pattern.id);
    if (differentPatterns.length) candidatePool = differentPatterns;
  }
  if (preferences.itemGroup === "all") {
    const availableGroups = [...new Set(candidatePool.map(recommendationItemGroup))];
    const selectedGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
    candidatePool = candidatePool.filter((item) => recommendationItemGroup(item) === selectedGroup);
  }
  const scoreBands = [...new Set(candidatePool.map((item) => scoreNumber(item.score)))].slice(0, 3);
  const selectedBand = scoreBands[Math.floor(Math.random() * scoreBands.length)];
  const bandMatches = candidatePool.filter((item) => scoreNumber(item.score) === selectedBand);
  const recommendation = bandMatches[Math.floor(Math.random() * bandMatches.length)];
  await applyRecommendation(recommendation);
  await renderRecommendationBoard();
  elements.save.classList.remove("saved");
  elements.save.textContent = translations[state.language].save;
  renderRecommendationReason(recommendation);
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
    tags: [
      selectedText(elements.craft),
      selectedText(elements.item),
      selectedText(elements.needle)
    ].join(" · "),
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
  updateFilters();
  refreshRecommendationCopy();
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
    ? { "구성": "실 · 패턴 · 합성 결과", "저장일": savedDate, "조건": item.tags }
    : { CONTENTS: "Yarn · Pattern · Result", SAVED: savedDate, FILTERS: item.tags };
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
  }) + colorThemeRows(pattern.color_themes);
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
libraryData.finally(renderRecommendationBoard);
