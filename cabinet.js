const PATTERNS = [
  ["Basket Bag", "basket-bag.png?v=20260928-3", "Crochet", "Intermediate", "Bag", "Basket Bag"],
  ["Beanie No. 6", "beanie-no-6.png?v=20260928-2", "Knit", "Beginner", "Hat"],
  ["Brigitte Headband", "brigitte-headband.png", "Knit", "Beginner", "Headband"],
  ["Cardigan No. 4", "cardigan-no-4.png?v=20260928-2", "Knit", "Advanced", "Cardigan"],
  ["Crochet Scrunchie Bag", "crochet-scrunchie-bag.png?v=20260928-2", "Crochet", "Intermediate", "Bag"],
  ["Fringe Checked Scarf", "fringe-checked-scarf.png?v=20260928-2", "Crochet", "Intermediate", "Scarf"],
  ["Harlequin Shawlette", "harlequin-shawlette.png", "Knit", "Intermediate", "Shawl"],
  ["Joanna Hat", "joanna-hat.png?v=20260928-2", "Knit", "Intermediate", "Hat"],
  ["Little Cinnamon Teddy Bear", "little-cinnamon-teddy-bear.png", "Crochet", "Intermediate", "Toy"],
  ["Overlap Scarf Knitup", "overlap-scarf-knitup.png", "Knit", "Intermediate", "Scarf"],
  ["Peace by Piece", "peace-by-piece.png?v=20260928-2", "Knit", "Intermediate", "Top"],
  ["You Better Work Socks", "you-better-work-socks.png?v=20260928-2", "Knit", "Advanced", "Socks"]
].map(([name, file, craft, skill, type, relatedItem]) => ({ name, image: `./assets/images/pattern/${file}`, category: craft, detail: skill, type, date: "Saved pattern", relatedItem }));

const ITEMS = [
  ["Tulip ETIMO Red Crochet Hook Set", "./assets/images/tools/croch-needle-set-red-tulip.png", "Tool", "Crochet hooks", "In use"],
  ["ChiaoGoo TWIST Blue Shorties", "./assets/images/tools/knitting-needle-set-chiaogu-blue-shorty-2inch.and.3inch.png", "Tool", "Knitting needles", "In use"],
  ["KnitPro Ginger Grande 5-inch Set", "./assets/images/tools/knitting-needle-set-ginger-3.5inch.png", "Tool", "Knitting needles", "In use"],
  ["Clover Takumi Combo Set", "./assets/images/tools/knitting-needle-set-takumi-5inch.png", "Tool", "Knitting needles", "In use"],
  ["Lotus Sahara 5-inch Set", null, "Tool", "Knitting needles", "Loved"],
  ["Basket Bag", "./assets/images/madeByMe/bag_2026.04.05.png?v=20260928-2", "Made by Me", "Bag", "2026.04.05", "https://www.purlsoho.com/create/2025/08/08/basket-bag/", "Free pattern", "Basket Bag"],
  ["Learn to Knit a Hat in the Round", "./assets/images/madeByMe/hat_2026.03.10.png", "Made by Me", "Hat", "2026.03.10", "https://www.purlsoho.com/create/2015/07/06/learn-to-knit-a-hat-in-the-round-kit/", "Free pattern"],
  ["Box Hat", "./assets/images/madeByMe/hat_2026.03.15.png", "Made by Me", "Hat", "2026.03.15", "https://www.purlsoho.com/create/2025/01/25/box-hat/", "Free pattern"],
  ["Nakyang Knit Bucket Hat", "./assets/images/madeByMe/hat_2026.03.22.png", "Made by Me", "Hat", "2026.03.22", "https://nakyang.store/goods/view?no=326", "Discontinued"],
  ["Staggered Fisherman's Rib Scarf", "./assets/images/madeByMe/scarf_2026.02.22.png", "Made by Me", "Scarf", "2026.02.22", "https://www.purlsoho.com/create/2020/02/26/staggered-fishermans-rib-scarf/", "Free pattern"],
  ["Reversible Cross-Collar Cowl", "./assets/images/madeByMe/scarf_2026.03.05.png", "Made by Me", "Scarf", "2026.03.05", "https://www.purlsoho.com/create/2023/09/18/reversible-cross-collar-cowl/", "Free pattern"]
].map(([name, image, category, type, date, patternUrl, patternStatus, relatedPattern]) => ({
  name,
  image,
  category,
  type,
  detail: date === "In use" ? date : "Finished",
  date,
  patternUrl,
  patternStatus,
  relatedPattern
}));

const PINTEREST_BOARD_URL = "https://kr.pinterest.com/grayrays/%ED%8C%A8%ED%84%B4/";
const TASTE_ITEMS = [
  "36098060bf30080736310c9e353b021f",
  "dd728a458d8c710ac74fd474f63bbfd1",
  "449a41f450cfa32f5d704f51c7b437fd",
  "b8682f184982dfa419ad7f039dcb8932",
  "64f0cf52aec18d93fc497014c3d2c856",
  "2d51d23880681aa421012c1145ac80f9",
  "15d63e30e8cdbbaa6d86f949385eb068",
  "d3af7b25ad014b6d7a05bdb5d14f34d9",
  "be33902e4757cf7194ee9f364f0ce907",
  "644733c8ee63b458fa611abdc442632b",
  "dd4186968b89188ab4b608b7e6ad3dd1",
  "f3d21b12272241396c6881389a93cad7"
].map((id, index) => ({
  name: `Pattern reference ${String(index + 1).padStart(2, "0")}`,
  image: `https://i.pinimg.com/474x/${id.slice(0, 2)}/${id.slice(2, 4)}/${id.slice(4, 6)}/${id}.jpg`,
  category: "Pinterest",
  type: "Pattern inspiration",
  detail: "Connected pin",
  date: "패턴 board",
  source: PINTEREST_BOARD_URL
}));

const TOOL_DETAILS = {
  "Tulip ETIMO Red Crochet Hook Set": {
    material: "Matte red aluminum · cushioned grip",
    sizes: "1.80, 2.00, 2.20, 2.50, 3.00, 3.50, 4.00, 5.00 mm",
    cables: "—",
    accessories: "Ruler · 2 tapestry needles · case",
    ko: {
      material: "무광 레드 알루미늄 · 쿠션 그립",
      sizes: "1.80, 2.00, 2.20, 2.50, 3.00, 3.50, 4.00, 5.00 mm",
      cables: "해당 없음",
      accessories: "자 · 돗바늘 2개 · 케이스"
    },
    source: "https://en.tulip-japan.co.jp/knitting_needle/"
  },
  "ChiaoGoo TWIST Blue Shorties": {
    material: "Solid and hollow stainless steel",
    sizes: "US 4–8 / 3.5–5.0 mm · 2-inch and 3-inch tips",
    cables: "X-Flex 5, 6, 8 inch / 13, 15, 20 cm",
    accessories: "Tip sleeve · stoppers · keys · connectors · markers · gauge · pouch",
    ko: {
      material: "솔리드 및 중공 스테인리스 스틸",
      sizes: "US 4–8 / 3.5–5.0 mm · 2인치 및 3인치 팁",
      cables: "X-Flex 5, 6, 8인치 / 13, 15, 20 cm",
      accessories: "팁 슬리브 · 스토퍼 · 조임 키 · 연결 부품 · 마커 · 게이지 · 파우치"
    },
    source: "https://www.chiaogoo.com/interchangeable/"
  },
  "KnitPro Ginger Grande 5-inch Set": {
    material: "Warm laminated birchwood",
    sizes: "13 pairs · 3.0–12.0 mm · 5-inch tips",
    cables: "60 cm ×2 · 80 cm ×2 · 100 cm ×2",
    accessories: "End caps · cable keys · scissors · tape · wool needles · stitch markers",
    compatibility: "Compatible with Lotus Sahara 360° swivel cables",
    ko: {
      material: "따뜻한 색감의 적층 자작나무",
      sizes: "13쌍 · 3.0–12.0 mm · 5인치 팁",
      cables: "60 cm ×2 · 80 cm ×2 · 100 cm ×2",
      accessories: "엔드캡 · 케이블 키 · 가위 · 줄자 · 돗바늘 · 스티치 마커",
      compatibility: "로터스 사하라 360° 회전 케이블과 호환 가능"
    },
    source: "https://www.knitpro.eu/usa/ginger-normal-interchangeable-needle-sets"
  },
  "Clover Takumi Combo Set": {
    material: "Bamboo tips · nylon cords · stainless steel joints",
    sizes: "12 pairs · US 3–15 / 3.25–10.0 mm",
    cables: "16, 24, 29, 36, 48 inch / 41–120 cm",
    accessories: "5 cords · synthetic leather case · cord case",
    ko: {
      material: "대나무 팁 · 나일론 코드 · 스테인리스 스틸 조인트",
      sizes: "12쌍 · US 3–15 / 3.25–10.0 mm",
      cables: "16, 24, 29, 36, 48인치 / 41–120 cm",
      accessories: "코드 5개 · 합성 가죽 케이스 · 코드 케이스"
    },
    source: "https://clover-usa.com/collections/knitting-and-crocheting/products/takumi-combo-set"
  },
  "Lotus Sahara 5-inch Set": {
    material: "Natural pink ivory wood · polished brass fittings",
    sizes: "10 pairs · US 2–10 / 2.75–6.0 mm · 5-inch tips",
    cables: "360° swivel: 35 cm ×1 · 55 cm ×2 · 75 cm ×1",
    accessories: "6 end caps · 4 cable keys · 2 connectors · genuine leather case",
    compatibility: "Sahara cables work with KnitPro Ginger tips · Sahara tips work with KnitPro GlideX cables",
    ko: {
      material: "천연 핑크 아이보리 우드 · 광택 황동 연결부",
      sizes: "10쌍 · US 2–10 / 2.75–6.0 mm · 5인치 팁",
      cables: "360° 회전: 35 cm ×1 · 55 cm ×2 · 75 cm ×1",
      accessories: "엔드캡 6개 · 케이블 키 4개 · 연결 부품 2개 · 천연 가죽 케이스",
      compatibility: "사하라 케이블은 니트프로 진저 팁과, 사하라 팁은 니트프로 글라이드X 케이블과 호환 가능"
    },
    source: "https://www.lotusyarns.com/products/sahara-5-interchangeable-circular-needles-set"
  }
};

ITEMS.forEach((item) => {
  if (TOOL_DETAILS[item.name]) {
    item.specs = TOOL_DETAILS[item.name];
    item.detail = item.name.startsWith("Lotus Sahara") ? "Loved" : "In use";
    item.placeholder = !item.image;
  }
});

const COPY = {
  patterns: {
    title: "패턴 보관함", enTitle: "Pattern Cabinet", eyebrow: "패턴 아카이브", enEyebrow: "Pattern archive", note: "다음에 만들고 싶은 형태와 구조를 모아두는 패턴 라이브러리.", enNote: "A pattern library for forms and structures I want to make next.", collection: "패턴 컬렉션", enCollection: "Pattern collection", unit: "patterns", koUnit: "개", items: PATTERNS,
    stats: [["PATTERNS", PATTERNS.length], ["CRAFTS", 2], ["TYPES", new Set(PATTERNS.map((item) => item.type)).size]],
    filters: [["CRAFT", "category"], ["SKILL", "detail"], ["TYPE", "type"], ["NEEDLE SIZE", "needleSize"]]
  },
  items: {
    title: "나의 아이템 보관함", enTitle: "My Items Cabinet", eyebrow: "도구와 내가 만든 것", enEyebrow: "Tools & made by me", note: "손에 익은 도구와 내가 직접 완성한 작업을 한곳에 모아둔 기록.", enNote: "A record of familiar tools and things I have made.", collection: "아이템 컬렉션", enCollection: "Item collection", unit: "items", koUnit: "개", items: ITEMS,
    stats: [["ITEMS", ITEMS.length], ["TOOLS", 5], ["MADE BY ME", 6]],
    filters: [["CATEGORY", "category"], ["TYPE", "type"], ["STATUS", "detail"]]
  },
  taste: {
    title: "취향 보관함", enTitle: "Taste Cabinet", eyebrow: "시각적 레퍼런스", enEyebrow: "Visual references", note: "색, 질감, 공간과 오브제를 모아 앞으로의 믹스에 연결할 취향 아카이브.", enNote: "An archive of colors, textures, spaces, and objects for future mixes.", collection: "취향 컬렉션", enCollection: "Taste collection", unit: "references", koUnit: "개",
    totalCount: 40, items: TASTE_ITEMS, stats: [["REFERENCES", 40], ["BOARDS", 1], ["CONNECTED", "YES"]], filters: []
  }
};

const UI_COPY = {
  ko: {
    nav: ["실 보관함", "패턴 보관함", "나의 아이템", "취향 보관함"],
    collectionEyebrow: "컬렉션", filters: "필터", reset: "초기화", search: "검색", searchPlaceholder: "이름, 유형, 세부 정보...",
    results: "개 결과", sort: "정렬", sortName: "이름순", sortCategory: "카테고리순", sortType: "유형순", grid: "격자", list: "목록",
    noResults: "조건에 맞는 항목이 없어요", noResultsNote: "검색어나 필터 범위를 조금 넓혀보세요.", clearFilters: "필터 초기화",
    emptyTaste: "아직 모아둔 취향이 없어요", emptyTasteNote: "Pinterest 보드를 연결하면 좋아하는 색, 질감, 공간과 오브제를 이 보관함의 재료로 가져올 수 있어요.", connectPinterest: "Pinterest 보드 연결",
    back: "믹스 룸으로 돌아가기 ↑", detailView: "상세 보기", close: "닫기", source: "공식 제품 페이지 ↗", buyPattern: "패턴 구매 페이지 ↗", freePattern: "무료 패턴 보기 ↗", discontinuedPattern: "판매 종료된 원작 페이지 ↗", viewMadeItem: "완성작 보기 ↗", viewSavedPattern: "패턴 보관함에서 보기 ↗", viewBoard: "Pinterest 보드 열기 ↗",
    pinterestTitle: "Pinterest 보드 연결", pinterestNote: "공유 보드도 연결할 수 있어요. 먼저 공개 또는 접근 가능한 보드 주소를 확인하고, 실제 자동 동기화 단계에서 Pinterest 로그인을 연결합니다.", boardUrl: "보드 주소", cancel: "취소", checkUrl: "주소 확인",
    filterNames: { CRAFT: "기법", SKILL: "난이도", TYPE: "유형", "NEEDLE SIZE": "바늘 크기", CATEGORY: "분류", STATUS: "상태" },
    values: { Knit: "대바늘", Crochet: "코바늘", Advanced: "고급", Intermediate: "중급", Beginner: "초급", Bag: "가방", Blanket: "블랭킷", Cardigan: "카디건", Hat: "모자", Headband: "헤드밴드", Scarf: "스카프", Shawl: "숄", Socks: "양말", Toy: "인형", Top: "상의", YES: "예", "Made by Me": "내가 만든 것", Tool: "도구", Pinterest: "Pinterest", "Pattern inspiration": "패턴 레퍼런스", "Connected pin": "연결된 핀", "Crochet hooks": "코바늘 세트", "Knitting needles": "대바늘 세트", Finished: "완성", "In use": "사용 중", Loved: "애정 도구", "Free pattern": "무료 패턴", Discontinued: "판매 종료", "Saved pattern": "저장한 패턴", "Not specified": "정보 미등록", "Gauge is not critical": "게이지가 중요하지 않음", "No stitch gauge specified": "스티치 게이지 미지정", "Tulip ETIMO Red Crochet Hook Set": "튤립 에티모 레드 코바늘 세트", "ChiaoGoo TWIST Blue Shorties": "치아오구 트위스트 블루 쇼티 세트", "KnitPro Ginger Grande 5-inch Set": "니트프로 진저 그란데 5인치 세트", "Clover Takumi Combo Set": "클로버 타쿠미 콤보 세트", "Lotus Sahara 5-inch Set": "로터스 사하라 5인치 세트", "Basket Bag": "바스켓 백", "Beanie No. 6": "비니 No. 6", "Brigitte Headband": "브리짓 헤드밴드", "Cardigan No. 4": "카디건 No. 4", "Crochet Scrunchie Bag": "코바늘 스크런치 백", "Fringe Checked Scarf": "프린지 체크 스카프", "Harlequin Shawlette": "할리퀸 숄렛", "Joanna Hat": "조안나 햇", "Little Cinnamon Teddy Bear": "리틀 시나몬 테디 베어", "Overlap Scarf": "오버랩 스카프", "Peace By Piece": "피스 바이 피스", "You Better Work Socks": "유 베터 워크 삭스" },
    statNames: { PATTERNS: "패턴", CRAFTS: "기법", TYPES: "유형", ITEMS: "아이템", TOOLS: "도구", "MADE BY ME": "내가 만든 것", REFERENCES: "레퍼런스", BOARDS: "보드", CONNECTED: "연결" },
    meta: { BRAND: "브랜드", DESIGNER: "디자이너", GAUGE: "게이지", "ORIGINAL YARN": "원작실", NEEDLE: "바늘", TYPE: "유형", MATERIAL: "재질", SIZES: "크기", CABLES: "케이블", INCLUDES: "구성품", COMPATIBLE: "호환", SOURCE: "출처", PATTERN: "원작 패턴", STATUS: "패턴 상태", "MADE ITEM": "나의 완성작", "SAVED PATTERN": "저장한 패턴", DETAIL: "상태", DATE: "완성일" }
  },
  en: {
    nav: ["Yarn", "Pattern", "My Items", "Taste"], collectionEyebrow: "The collection", filters: "Filters", reset: "Reset", search: "Search", searchPlaceholder: "Name, type, detail...",
    results: "results", sort: "Sort", sortName: "Name A-Z", sortCategory: "Category", sortType: "Type", grid: "Grid", list: "List",
    noResults: "No matching items", noResultsNote: "Try widening the search or filters.", clearFilters: "Clear filters",
    emptyTaste: "No taste references yet", emptyTasteNote: "Connect a Pinterest board to bring colors, textures, spaces, and objects into this cabinet.", connectPinterest: "Connect Pinterest board",
    back: "Back to Mix Room ↑", detailView: "View details", close: "Close", source: "Official product page ↗", buyPattern: "Buy pattern ↗", freePattern: "View free pattern ↗", discontinuedPattern: "View discontinued source ↗", viewMadeItem: "View finished item ↗", viewSavedPattern: "View saved pattern ↗", viewBoard: "Open Pinterest board ↗",
    pinterestTitle: "Connect Pinterest board", pinterestNote: "Shared boards can be connected too. Check the board URL first, then connect your Pinterest login for live sync.", boardUrl: "Board URL", cancel: "Cancel", checkUrl: "Check URL",
    filterNames: {}, values: {}, statNames: {}, meta: {}
  }
};

const pageKey = document.body.dataset.cabinet;
const page = COPY[pageKey];
const state = { query: "", filters: {}, sort: "name", view: "grid", language: window.SiteState.getLanguage() };
const el = (id) => document.getElementById(id);

function formatGauge(gauge = {}) {
  if (gauge.status) return gauge.status;
  const rowCount = gauge.rows || gauge.rounds;
  const rowLabel = gauge.rows ? "rows" : "rounds";
  const counts = [gauge.stitches && `${gauge.stitches} sts`, rowCount && `${rowCount} ${rowLabel}`].filter(Boolean).join(" × ");
  const measurement = gauge.over ? ` / ${gauge.over}` : "";
  return `${counts}${measurement}` || "Not specified";
}

function formatOriginalYarn(yarn = {}) {
  if (yarn.lower_section) {
    const lower = [yarn.lower_section.brand, yarn.lower_section.base].filter(Boolean).join(" ");
    const upper = yarn.upper_section_options?.[0];
    return [lower, upper && [upper.brand, upper.base].filter(Boolean).join(" ")].filter(Boolean).join(" + ");
  }
  if (yarn.main_color || yarn.contrast_color) {
    return [yarn.main_color?.base, yarn.contrast_color?.base].filter(Boolean).join(" + ");
  }
  return [yarn.brand, yarn.base || yarn.sample_yarn || yarn.main_combination || yarn.weight].filter(Boolean).join(" ") || "Not specified";
}

function formatNeedleSize(value = "") {
  const range = value.match(/\d+(?:\.\d+)?\s*[-–]\s*\d+(?:\.\d+)?\s*mm/i);
  if (range) return range[0].replace(/\s*[-–]\s*/, "–").replace(/\s*mm/i, " mm");
  const metric = value.match(/\d+(?:\.\d+)?\s*mm/i);
  return metric ? metric[0].replace(/\s*mm/i, " mm") : "Not specified";
}

async function enrichPatternDetails() {
  if (pageKey !== "patterns") return;
  try {
    const response = await fetch("./data/pattern-library.json");
    if (!response.ok) throw new Error("Pattern metadata unavailable");
    const metadata = await response.json();
    PATTERNS.forEach((item) => {
      const fileName = item.image.split("/").pop().split("?")[0];
      const source = metadata.find((entry) => entry.image?.asset_path?.endsWith(fileName));
      if (!source) return;
      item.name = source.title;
      item.category = source.craft === "crochet" ? "Crochet" : "Knit";
      item.type = source.category ? source.category.charAt(0).toUpperCase() + source.category.slice(1) : item.type;
      item.brand = source.brand || "Independent";
      item.designer = source.designer || "Not specified";
      item.gauge = formatGauge(source.gauge);
      item.originalYarn = formatOriginalYarn(source.recommended_yarn);
      item.needle = source.gauge?.needle || source.tools?.[0] || "Not specified";
      item.needleSize = formatNeedleSize(item.needle);
      item.patternUrl = source.pattern_access?.purchase_url || null;
    });
  } catch (error) {
    PATTERNS.forEach((item) => {
      item.gauge = "Not specified";
      item.originalYarn = "Not specified";
      item.needle = "Not specified";
      item.needleSize = "Not specified";
    });
  }
}

function unique(field) {
  const values = [...new Set(page.items.map((item) => item[field]))];
  if (pageKey === "patterns" && field === "detail") {
    const skillOrder = ["Advanced", "Intermediate", "Beginner"];
    return values.sort((a, b) => skillOrder.indexOf(a) - skillOrder.indexOf(b));
  }
  if (pageKey === "patterns" && field === "needleSize") {
    return values.sort((a, b) => {
      if (a === "Not specified") return 1;
      if (b === "Not specified") return -1;
      return Number.parseFloat(a) - Number.parseFloat(b);
    });
  }
  return values.sort((a, b) => a.localeCompare(b));
}

function translated(value) {
  if (state.language === "en") return value;
  if (UI_COPY.ko.values[value]) return UI_COPY.ko.values[value];
  if (/not specified/i.test(value)) return "정보 미등록";
  if (value === "NO") return "아니요";
  return value;
}

function metaLabel(label) {
  return state.language === "ko" ? UI_COPY.ko.meta[label] || label : label;
}

function specValue(specs, key) {
  return state.language === "ko" ? specs.ko?.[key] || specs[key] : specs[key];
}

function applyStaticCopy() {
  const copy = UI_COPY[state.language];
  document.querySelectorAll(".site-nav a").forEach((link, index) => { link.textContent = copy.nav[index]; });
  document.querySelector(".section-heading .eyebrow").textContent = copy.collectionEyebrow;
  el("mobileFilterButton").textContent = copy.filters;
  document.querySelector(".filter-heading h3").textContent = copy.filters;
  el("resetFilters").textContent = copy.reset;
  document.querySelector(".search-field span").textContent = copy.search;
  el("searchInput").placeholder = copy.searchPlaceholder;
  document.querySelector(".collection-toolbar p").lastChild.textContent = ` ${copy.results}`;
  el("sortSelect").options[0].textContent = copy.sortName;
  el("sortSelect").options[1].textContent = copy.sortCategory;
  el("sortSelect").options[2].textContent = copy.sortType;
  const viewButtons = el("viewToggle").querySelectorAll("button");
  viewButtons[0].textContent = copy.grid;
  viewButtons[1].textContent = copy.list;
  el("filterEmpty").querySelector("h3").textContent = copy.noResults;
  el("filterEmpty").querySelector("p").textContent = copy.noResultsNote;
  el("emptyReset").textContent = copy.clearFilters;
  el("tasteEmpty").querySelector("h3").textContent = copy.emptyTaste;
  el("tasteEmpty").querySelector("p").textContent = copy.emptyTasteNote;
  el("connectPinterest").textContent = copy.connectPinterest;
  document.querySelector(".site-footer a").textContent = copy.back;
  document.querySelector(".site-footer span").textContent = state.language === "ko" ? "Skein to Mood · 네 개의 보관함" : "Skein to Mood · Four cabinets";
  document.querySelector("#pinterestDialog h2").textContent = copy.pinterestTitle;
  document.querySelector("#pinterestDialog form > p").textContent = copy.pinterestNote;
  document.querySelector("#pinterestDialog label").childNodes[0].textContent = copy.boardUrl;
  el("cancelPinterest").textContent = copy.cancel;
  document.querySelector("#pinterestForm .primary").textContent = copy.checkUrl;
  el("closeDialog").setAttribute("aria-label", copy.close);
}

function applyPageCopy() {
  const ko = state.language === "ko";
  document.title = `${ko ? page.title : page.enTitle} | Skein to Mood`;
  el("heroEyebrow").textContent = ko ? page.eyebrow : page.enEyebrow;
  el("pageTitle").textContent = ko ? page.title : page.enTitle;
  el("heroNote").textContent = ko ? page.note : page.enNote;
  el("collectionTitle").textContent = ko ? page.collection : page.enCollection;
  el("headerCount").textContent = String(page.totalCount ?? page.items.length).padStart(2, "0");
  el("headerUnit").textContent = ko ? page.koUnit : page.unit;
  el("stats").innerHTML = page.stats.map(([label, value]) => `<div><dt>${ko ? UI_COPY.ko.statNames[label] || label : label}</dt><dd>${translated(String(value).padStart(typeof value === "number" ? 2 : 0, "0"))}</dd></div>`).join("");
  applyStaticCopy();
}

function renderFilters() {
  const root = el("filterGroups");
  root.innerHTML = page.filters.map(([label, field]) => {
    const options = unique(field).map((value) => {
      const count = page.items.filter((item) => item[field] === value).length;
      const checked = state.filters[field]?.has(value) ? " checked" : "";
      return `<label class="filter-option"><input type="checkbox" data-filter="${field}" value="${value}"${checked}><span>${translated(value)}</span><small>${count}</small></label>`;
    }).join("");
    const translatedLabel = state.language === "ko" ? UI_COPY.ko.filterNames[label] || label : label;
    return `<fieldset class="filter-group"><legend>${translatedLabel}</legend><div class="filter-options">${options}</div></fieldset>`;
  }).join("");
}

function filteredItems() {
  const query = state.query.trim().toLowerCase();
  return page.items.filter((item) => {
    const matchesQuery = !query || Object.values(item).join(" ").toLowerCase().includes(query);
    const matchesFilters = Object.entries(state.filters).every(([field, values]) => !values.size || values.has(item[field]));
    return matchesQuery && matchesFilters;
  }).sort((a, b) => {
    if (state.sort === "category") return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    if (state.sort === "type") return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });
}

function render() {
  const items = filteredItems();
  el("resultCount").textContent = items.length;
  el("itemGrid").className = `item-grid ${state.view === "list" ? "list" : ""}`;
  el("itemGrid").innerHTML = items.map((item) => `
    <button class="item-card" type="button" data-index="${page.items.indexOf(item)}" aria-label="${translated(item.name)} ${UI_COPY[state.language].detailView}">
      <span class="card-media">${item.placeholder ? `<span class="tool-placeholder" role="img" aria-label="${item.name} ${state.language === "ko" ? "인디 핑크 플레이스홀더" : "indie pink placeholder"}"><small>LOTUS YARNS</small><strong>SAHARA</strong><b>5\" INTERCHANGEABLE SET</b></span>` : `<img src="${item.image}" alt="${translated(item.name)}" loading="lazy">`}</span>
      <span class="card-copy">
        <span class="card-label"><span>${translated(item.category)}</span><span>${translated(item.type)}</span></span>
        <h3>${translated(item.name)}</h3><p>${item.detail === item.date ? translated(item.detail) : `${translated(item.detail)} · ${translated(item.date)}`}</p>
        ${pageKey === "patterns" ? `<dl class="card-specs"><div><dt>${metaLabel("GAUGE")}</dt><dd>${translated(item.gauge)}</dd></div><div><dt>${metaLabel("ORIGINAL YARN")}</dt><dd>${item.originalYarn}</dd></div></dl>` : ""}
      </span>
    </button>`).join("");
  const noResults = page.items.length > 0 && items.length === 0;
  el("itemGrid").hidden = noResults;
  el("filterEmpty").hidden = !noResults;
}

function openItem(index) {
  const item = page.items[index];
  el("dialogImage").hidden = item.placeholder;
  el("dialogPlaceholder").hidden = !item.placeholder;
  if (!item.placeholder) {
    el("dialogImage").src = item.image;
    el("dialogImage").alt = item.name;
  }
  el("dialogEyebrow").textContent = translated(item.category);
  el("dialogTitle").textContent = translated(item.name);
  el("dialogDescription").textContent = state.language === "ko"
    ? pageKey === "patterns" ? "이 패턴을 다음 믹스의 형태와 구조로 사용할 수 있어요." : pageKey === "taste" ? "연결한 Pinterest 보드에서 가져온 패턴 레퍼런스예요." : item.category === "Tool" ? "손에 익은 도구의 재료와 세트 구성을 기록해두었어요." : "나의 작업 과정과 함께 기억해둘 아이템이에요."
    : pageKey === "patterns" ? "Use this pattern as the form and structure of a future mix." : pageKey === "taste" ? "A pattern reference from the connected Pinterest board." : item.category === "Tool" ? "Materials and set contents for a familiar tool." : "An item to remember with its making process.";
  el("dialogMeta").innerHTML = pageKey === "patterns"
    ? `<div><dt>${metaLabel("BRAND")}</dt><dd>${item.brand}</dd></div><div><dt>${metaLabel("DESIGNER")}</dt><dd>${translated(item.designer)}</dd></div><div><dt>${metaLabel("GAUGE")}</dt><dd>${translated(item.gauge)}</dd></div><div><dt>${metaLabel("ORIGINAL YARN")}</dt><dd>${item.originalYarn}</dd></div><div><dt>${metaLabel("NEEDLE")}</dt><dd>${translated(item.needle)}</dd></div>${item.patternUrl ? `<div><dt>${metaLabel("SOURCE")}</dt><dd><a href="${item.patternUrl}" target="_blank" rel="noreferrer">${UI_COPY[state.language].buyPattern}</a></dd></div>` : ""}${item.relatedItem ? `<div><dt>${metaLabel("MADE ITEM")}</dt><dd><a href="./items.html?open=${encodeURIComponent(item.relatedItem)}">${UI_COPY[state.language].viewMadeItem}</a></dd></div>` : ""}`
    : pageKey === "taste"
      ? `<div><dt>${metaLabel("TYPE")}</dt><dd>${translated(item.type)}</dd></div><div><dt>BOARD</dt><dd>${item.date}</dd></div><div><dt>${metaLabel("SOURCE")}</dt><dd><a href="${item.source}" target="_blank" rel="noreferrer">${UI_COPY[state.language].viewBoard}</a></dd></div>`
    : item.specs
      ? `<div><dt>${metaLabel("TYPE")}</dt><dd>${translated(item.type)}</dd></div><div><dt>${metaLabel("MATERIAL")}</dt><dd>${specValue(item.specs, "material")}</dd></div><div><dt>${metaLabel("SIZES")}</dt><dd>${specValue(item.specs, "sizes")}</dd></div><div><dt>${metaLabel("CABLES")}</dt><dd>${specValue(item.specs, "cables")}</dd></div><div><dt>${metaLabel("INCLUDES")}</dt><dd>${specValue(item.specs, "accessories")}</dd></div>${item.specs.compatibility ? `<div><dt>${metaLabel("COMPATIBLE")}</dt><dd>${specValue(item.specs, "compatibility")}</dd></div>` : ""}<div><dt>${metaLabel("SOURCE")}</dt><dd><a href="${item.specs.source}" target="_blank" rel="noreferrer">${UI_COPY[state.language].source}</a></dd></div>`
      : `<div><dt>${metaLabel("TYPE")}</dt><dd>${translated(item.type)}</dd></div><div><dt>${metaLabel("DETAIL")}</dt><dd>${translated(item.detail)}</dd></div><div><dt>${metaLabel("DATE")}</dt><dd>${item.date}</dd></div>${item.patternStatus ? `<div><dt>${metaLabel("STATUS")}</dt><dd>${translated(item.patternStatus)}</dd></div>` : ""}${item.patternUrl ? `<div><dt>${metaLabel("PATTERN")}</dt><dd><a href="${item.patternUrl}" target="_blank" rel="noreferrer">${item.patternStatus === "Discontinued" ? UI_COPY[state.language].discontinuedPattern : UI_COPY[state.language].freePattern}</a></dd></div>` : ""}${item.relatedPattern ? `<div><dt>${metaLabel("SAVED PATTERN")}</dt><dd><a href="./patterns.html?open=${encodeURIComponent(item.relatedPattern)}">${UI_COPY[state.language].viewSavedPattern}</a></dd></div>` : ""}`;
  el("itemDialog").showModal();
}

function setLanguage(language, { persist = true } = {}) {
  state.language = language;
  if (persist) window.SiteState.setLanguage(language);
  document.documentElement.lang = language;
  document.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  applyPageCopy();
  renderFilters();
  render();

const requestedItem = new URLSearchParams(window.location.search).get("open");
if (requestedItem) {
  const requestedIndex = page.items.findIndex((item) => item.name === requestedItem);
  if (requestedIndex >= 0) openItem(requestedIndex);
}
}

window.addEventListener("site-language-change", (event) => setLanguage(event.detail.language, { persist: false }));

await enrichPatternDetails();
setLanguage(state.language, { persist: false });

el("searchInput").addEventListener("input", (event) => { state.query = event.target.value; render(); });
el("filterGroups").addEventListener("change", (event) => {
  if (!event.target.matches("[data-filter]")) return;
  const field = event.target.dataset.filter;
  state.filters[field] ||= new Set();
  event.target.checked ? state.filters[field].add(event.target.value) : state.filters[field].delete(event.target.value);
  render();
});
el("sortSelect").addEventListener("change", (event) => { state.sort = event.target.value; render(); });
el("viewToggle").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  state.view = button.dataset.view;
  el("viewToggle").querySelectorAll("button").forEach((option) => { option.classList.toggle("active", option === button); option.setAttribute("aria-pressed", String(option === button)); });
  render();
});
el("itemGrid").addEventListener("click", (event) => { const card = event.target.closest("[data-index]"); if (card) openItem(Number(card.dataset.index)); });
el("resetFilters").addEventListener("click", () => {
  state.query = ""; state.filters = {}; el("searchInput").value = "";
  el("filterGroups").querySelectorAll("input").forEach((input) => { input.checked = false; }); render();
});
el("emptyReset").addEventListener("click", () => el("resetFilters").click());
el("closeDialog").addEventListener("click", () => el("itemDialog").close());
el("itemDialog").addEventListener("click", (event) => {
  if (event.target === el("itemDialog")) el("itemDialog").close();
});
el("mobileFilterButton").addEventListener("click", () => {
  const open = el("filters").classList.toggle("open");
  el("mobileFilterButton").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));

if (pageKey === "taste") {
  el("libraryLayout").classList.add("taste-layout");
  el("filters").hidden = true;
  el("collectionToolbar").hidden = page.items.length === 0;
  el("itemGrid").hidden = page.items.length === 0;
  el("tasteEmpty").hidden = page.items.length > 0;
  el("connectPinterest").addEventListener("click", () => el("pinterestDialog").showModal());
  el("cancelPinterest").addEventListener("click", () => el("pinterestDialog").close());
  el("pinterestDialog").addEventListener("click", (event) => {
    if (event.target === el("pinterestDialog")) el("pinterestDialog").close();
  });
  el("pinterestForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const url = el("pinterestUrl").value.trim();
    const valid = /^https?:\/\/(www\.)?pinterest\.[^/]+\//i.test(url);
    el("connectionNote").textContent = valid ? "보드 주소를 확인했어요. 실제 동기화에는 Pinterest 로그인이 한 번 더 필요해요." : "Pinterest 보드 주소를 입력해주세요.";
  });
}
