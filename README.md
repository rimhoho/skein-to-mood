# Skein to Mood

**A personal mood-mapping studio for yarn, patterns, handmade objects, and visual references.**

Skein to Mood는 실 보관함에서 시작해 패턴, 직접 만든 아이템, 취향 레퍼런스를 함께 모으고 조합하는 개인 아카이브다. 오늘의 기분을 선택하면 실과 패턴을 무작위로 매칭하고, 선택한 실의 색과 질감을 패턴 이미지에 입힌 합성 미리보기를 만든다.

## Live Site

[https://rimhoho.github.io/skein-to-mood/](https://rimhoho.github.io/skein-to-mood/)

이전 `wireframe.html` 주소는 메인 페이지로 자동 이동한다.

## Current Pages

| Page | URL | Purpose |
| --- | --- | --- |
| The Mix Room | `/` | 오늘의 무드 체크인, 실·패턴 조합 생성, 합성 미리보기, 믹스 저장 |
| Yarn Cabinet | `/yarns.html#stash` | 실 검색, 정렬, 브랜드·굵기·베이스·섬유·색상 필터와 상세 정보 |
| Pattern Cabinet | `/patterns.html#top` | 패턴 검색과 필터, 게이지·원작실·니들 사이즈 상세 정보 |
| My Items | `/items.html#top` | 도구와 직접 만든 작품 기록 |
| Taste Cabinet | `/taste.html#top` | 취향 레퍼런스와 Pinterest 보드 연결 진입점 |

## Main Features

- **Mood check-in:** 온도와 에너지 슬라이더, 무드 키워드로 오늘의 감각을 선택한다.
- **Feeling Lucky / 조합 생성:** 보관함의 실과 패턴을 새로 조합한다.
- **Pattern synthesis preview:** 패턴 대표 이미지 위에 선택한 실의 평균 색상과 실제 실 이미지를 Canvas로 혼합한다.
- **Saved mixes:** 합성 결과와 연결 정보를 브라우저 `localStorage`에 저장하고 상세 팝업에서 확인하거나 삭제한다.
- **Four cabinets:** Yarn, Pattern, My Items, Taste를 독립된 보관함으로 탐색한다.
- **Filtering and sorting:** 각 보관함에서 검색, 카테고리 필터, 정렬, Grid/List 전환을 제공한다.
- **Detail dialogs:** 카드 또는 믹스를 선택하면 이미지와 메타데이터를 오프화이트 톤 팝업으로 보여준다. 팝업 바깥을 눌러 닫을 수 있다.
- **Shared language state:** 한국어/영어 선택이 모든 페이지에 이어진다.
- **Shared theme state:** 기본 다크 테마와 라이트 테마를 해/달 버튼으로 전환하며 선택은 모든 페이지에 유지된다.
- **Responsive navigation:** 모바일에서는 로고와 사이트명 아래에 보관함 내비게이션이 배치된다.
- **Pinterest entry point:** 공개 Pinterest 보드 URL을 확인하고 외부 보드로 이동할 수 있다. Pinterest API 기반 자동 동기화는 아직 구현되지 않았다.

## Current Collection

- Yarn entries: **33**
- Total skeins: **53**
- Brands: **2**
- Pattern entries: **12**
- Yarn images: **30**
- Pattern images: **13**
- Made-by-me images: **6**
- Tool images: **4**

수량과 이미지 수는 컬렉션 업데이트에 따라 달라질 수 있다.

## Design Direction

Are.na의 조용하고 정보 중심적인 피드와 아카이브 UI를 참고해, 장식보다 콘텐츠가 먼저 보이는 개인 작업실을 지향한다.

- 오프화이트와 따뜻한 회갈색 기반의 라이트/다크 테마
- 굵은 프레임 대신 얇은 경계선
- IBM Plex Sans KR 중심의 절제된 타이포그래피
- 카드보다 이미지와 메타데이터를 중심으로 한 플랫한 레이아웃
- 모바일에서도 빠르게 보관함 사이를 이동할 수 있는 고정 헤더

## Data

### `data/my-yarn-stash.json`

실 재고의 원본 데이터다. 각 항목은 다음과 같은 정보를 포함할 수 있다.

- `id`, `brand`, `base`, `colorway`, `quantity`
- `weight`, `fiber_content`, `skein_weight_g`, `yardage_m`
- `color_family`, `palette_hex`, `mood`, `texture`, `pattern_ideas`
- `batch_code`, `care`, `notes`, `source`, `image`

`id`는 소문자 kebab-case, `quantity`는 숫자, 알 수 없는 값은 `null`을 사용한다. `palette_hex`에는 보관함 컬러칩과 패턴 합성에 함께 쓰는 대표색 2~3개를 저장한다. 같은 색상이라도 베이스가 다르면 별도 항목으로 기록한다.

### `data/pattern-library.json`

패턴 카드와 상세 팝업에서 사용하는 패턴 데이터다. 디자이너, 기술 수준, 게이지, 원작실, 니들 사이즈, 관련 완성작 등의 정보를 담는다.

### `data/shop-yarn-bases.json`

브랜드와 실 베이스의 보조 메타데이터다. 실 상세 정보와 Mix Room의 조합 설명을 보완한다.

## State Management

이 프로젝트는 백엔드 없이 브라우저에서 동작한다.

- 언어: `skein-to-mood:language`
- 테마: `skein-to-mood:theme`
- 저장한 믹스: `localStorage`의 Mix Room 전용 키

`site-state.js`가 언어와 테마를 공통 관리하고, 각 페이지는 `storage` 이벤트를 통해 변경 상태를 공유한다. 저장한 믹스는 현재 브라우저와 기기에만 남는다.

## File Structure

```txt
skein-to-mood/
├─ index.html              # The Mix Room / main page
├─ yarns.html              # Yarn Cabinet
├─ patterns.html           # Pattern Cabinet
├─ items.html              # My Items
├─ taste.html              # Taste Cabinet
├─ wireframe.html          # Legacy URL redirect
├─ wireframe.css
├─ wireframe.js
├─ styles.css
├─ script.js
├─ cabinet.css
├─ cabinet.js
├─ site-state.js           # Shared language and theme state
├─ data/
│  ├─ my-yarn-stash.json
│  ├─ pattern-library.json
│  └─ shop-yarn-bases.json
├─ assets/images/
│  ├─ yarn/
│  ├─ pattern/
│  ├─ madeByMe/
│  ├─ tools/
│  └─ textures/
├─ _config.yml
├─ chatgpt-instructions.md
└─ README.md
```

## Local Development

빌드 과정이나 npm 의존성은 없다. JSON을 `fetch()`하므로 `file://`로 직접 열지 말고 간단한 정적 서버를 사용한다.

```powershell
python -m http.server 4173
```

브라우저에서 [http://127.0.0.1:4173/](http://127.0.0.1:4173/)을 연다.

## GitHub Pages

이 저장소는 GitHub Pages project site다.

1. Repository **Settings**에서 **Pages**를 연다.
2. Source를 `Deploy from a branch`로 선택한다.
3. `main` 브랜치와 `/root` 폴더를 선택한다.
4. 배포가 끝나면 루트 URL에서 `index.html`의 Mix Room이 열린다.

## Notes

- 사이트는 정적 HTML, CSS, JavaScript로 구성된다.
- 합성 이미지는 서버 생성 이미지가 아니라 브라우저 Canvas 미리보기다.
- 사용자 계정이나 클라우드 동기화는 아직 없다.
- 실과 패턴 데이터는 JSON 파일을 수정해 확장한다.
