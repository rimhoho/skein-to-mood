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
- Record brand, base, colorway, fiber content, weight, quantity, yardage, and mood.
- Build color moodboards from yarns.
- Match yarns with knitting/crochet pattern ideas.
- Keep a `chatgpt-instructions.md` file that can be copied into ChatGPT custom instructions or project context.
- Keep yarn data structured enough to update, filter, and expand over time.

## Design Direction

The site uses a bold, colorful, editorial layout inspired by playful DTC websites.

Style keywords:

- Big typography
- Full-color sections
- Chunky rounded buttons
- Rounded yarn cards
- Moodboard color chips
- Cozy but modern visual identity
- Personal archive feeling, like a virtual yarn closet

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
├─ my-yarn-stash.json
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

## Yarn Stash Data

Yarn inventory is stored in `my-yarn-stash.json`.

Each yarn entry records both practical knitting information and mood-board information:

- brand
- base
- colorway
- quantity
- yarn weight
- fiber content
- skein weight
- yardage
- batch code, barcode, or SKU when available
- color family
- mood keywords
- texture keywords
- pattern ideas
- notes
- source information when the yarn is from a set, lucky dip bag, or archived colourway page

## How to Add a Yarn

Add a new item to `my-yarn-stash.json`.

Basic example:

```json
{
  "id": "qing-fibre-melted-baby-suri-smoke",
  "brand": "Qing Fibre",
  "base": "Melted Baby Suri",
  "colorway": "Smoke",
  "quantity": 1,
  "weight": "lace / fluffy lace",
  "fiber_content": {
    "baby_suri_alpaca": 65,
    "merino": 20,
    "silk": 15
  },
  "skein_weight_g": 50,
  "yardage_m": 175,
  "batch_code": "2649",
  "care": "Wash before use in cold water with a little wool wash. May bleed during first couple of washes. Lay flat to dry.",
  "color_family": [
    "pale blue grey",
    "mist grey",
    "soft green",
    "muted gold",
    "smoky blue"
  ],
  "mood": [
    "misty",
    "quiet",
    "foggy",
    "soft smoke",
    "winter garden"
  ],
  "texture": [
    "fluffy",
    "halo",
    "airy",
    "brushed"
  ],
  "notes": "Pale smoky blue-grey Melted Baby Suri with muted green and golden-brown patches.",
  "pattern_ideas": [
    "held-together cardigan",
    "misty neck warmer",
    "soft hat",
    "collar accent",
    "gentle stripe project"
  ]
}
```

## Data Conventions

- `id` uses lowercase kebab-case.
  - Example: `qing-fibre-baby-teddy-noctilucent-cloud`
- `brand`, `base`, and `colorway` use display-ready names.
  - Example: `Qing Fibre`, `Baby Teddy`, `Noctilucent Cloud`
- `colorway` names use Title Case.
  - Example: `Crop Circle`, `Rose Tinted`, `Moon Goddess`
- If the same colorway exists on different bases, each base is stored as a separate yarn item.
  - Example: `Baby Teddy / Echo` and `Yak / Echo`
- Unknown values are stored as `null`.
- `quantity` is stored as a number.
  - Example: `1`
- Fiber content is stored as an object with percentage values.
- Yardage is stored in meters when available.
- `pattern_ideas` are planning prompts, not confirmed pattern matches.
- `notes` can include personal observations about color, texture, or project ideas.

## Special Yarn Sources

Some skeins are from lucky dip bags, fade sets, or archived colourways.

When a detailed product page is no longer available, the `source` field records where the colorway was identified.

Example:

```json
{
  "source": {
    "type": "archived_colourway_page",
    "name": "Punjabi",
    "note": "Detailed product page is no longer available; colorway is identified from Qing Fibre's colourway archive."
  }
}
```

When a skein belongs to a fade set and the individual skein name is not listed, it is recorded with the set name and a descriptive temporary colorway name.

Example:

```json
{
  "colorway": "Moonage Fade Set - Unnamed Pink Lavender Skein",
  "set_name": "Moonage Fade Set - Melted Baby Suri",
  "source": {
    "type": "official_product_page",
    "name": "Moonage Fade Set - Melted Baby Suri",
    "note": "Official page describes the set as 5 skeins of Melted Baby Suri fading from gentle pinks to dewy violets; individual skein names are not listed."
  }
}
```

## Current Stash Notes

The stash currently includes a growing Qing Fibre collection across several bases:

- Melted Baby Suri
- Baby Teddy
- Teddy
- Dashing Fingering
- Dashing Sassy
- Merino Singles
- Yak

This includes regular skeins, Lucky Dip Bag skeins, archived colourways, and one Moonage Fade Set skein.

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
- Archive notes for discontinued or lucky dip colorways