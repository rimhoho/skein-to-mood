# Skein to Mood

**A visual yarn closet & knit planning journal.**

Skein to Mood is a personal yarn archive built as a colorful GitHub Pages project site.  
It tracks yarn stash like a virtual closet, turns each yarn’s color and fiber into moodboards, and helps plan future knitting or crochet projects.

## Concept

뉴욕에서 우연히 시작한 뜨개가 목도리, 넥워머, 가방, 버킷햇, 니트모자로 이어졌고, 어느새 손염색실을 모으는 무서운 길에 들어섰다.

Skein to Mood는 쌓여가는 실을 가상 클로젯처럼 기록하고, 각 실이 가진 색과 재질을 무드보드로 풀어내며, 그 실에 어울리는 패턴을 찾아가는 니트 플래닝 저널.

## Live Site

```txt
https://rimhoho.github.io/skein-to-mood/
```

## Site Goals

- Show yarn stash visually.
- Record brand, yarn name, colorway, fiber, weight, quantity, and mood.
- Build color moodboards from yarns.
- Match yarns with knitting/crochet pattern ideas.
- Keep a `chatgpt-instructions.md` file that can be copied into ChatGPT custom instructions or project context.

## Design Direction

The site uses a bold, colorful, editorial layout inspired by playful DTC websites.

Style keywords:

- Big typography
- Full-color sections
- Chunky rounded buttons
- Rounded yarn cards
- Moodboard color chips
- Cozy but modern visual identity

Main palette:

| Name | Hex |
| --- | --- |
| Cream | `#F4EBDD` |
| Oatmeal Beige | `#D8C3A8` |
| Rothko Taupe Brown | `#7B6555` |
| Smoky Gray | `#8A8882` |
| Smoke Blue Gray | `#B8C5D3` |
| Pale Lilac Gray | `#A79BA5` |
| Antique Rose Brown | `#9A6F67` |
| Deep Cacao Plum | `#302226` |
| Ink Brown | `#241D1A` |

## File Structure

```txt
skein-to-mood/
├─ index.html
├─ styles.css
├─ script.js
├─ yarns.json
├─ _config.yml
├─ chatgpt-instructions.md
├─ README.md
├─ .gitignore
└─ assets/
   └─ images/
      ├─ yak-single-rothko.jpg
      ├─ melted-baby-suri-smoke.jpg
      ├─ blackbird-linen-ink-blue.jpg
      └─ quartz-fume.jpg
```

## How to Add a Yarn

Add a new item to `yarns.json`.

```json
{
  "id": "brand-yarn-colorway",
  "brand": "Brand Name",
  "name": "Yarn Name Colorway",
  "colorway": "Colorway",
  "fiber": "Fiber content",
  "weight": "Fingering",
  "quantity": "1 skein",
  "color": "#B8C5D3",
  "image": "./assets/images/example.jpg",
  "mood": ["smoky", "soft", "painterly"],
  "bestFor": ["cardigan", "shawl"],
  "pairingIdeas": ["Another yarn"],
  "note": "Planning note."
}
```

## GitHub Pages Setup

This is a project site.

Repository name:

```txt
skein-to-mood
```

Published URL:

```txt
https://rimhoho.github.io/skein-to-mood/
```

In GitHub:

1. Go to repository **Settings**
2. Open **Pages**
3. Set source to `Deploy from a branch`
4. Choose `main`
5. Choose `/root`
6. Save

## Notes

This is a static site. No build tools, npm, or backend are required for the first version.

Future ideas:

- Yarn detail pages
- Filter by fiber, weight, season, or mood
- Pattern match database
- Moodboard generator
- Project journal entries
- Copyable ChatGPT context export