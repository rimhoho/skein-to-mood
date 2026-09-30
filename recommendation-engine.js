const WEIGHT_RANKS = {
  thread: 0,
  lace: 0,
  fingering: 1,
  sock: 1,
  sport: 2,
  dk: 3,
  "light worsted": 3.5,
  worsted: 4,
  aran: 4.5,
  bulky: 5,
  "super bulky": 6
};

const ITEM_GROUPS = {
  accessory: new Set(["hat", "headband", "socks", "scarf", "shawl"]),
  garment: new Set(["cardigan", "sweater", "top", "vest"]),
  home: new Set(["bag", "blanket", "toy", "home"])
};

function text(value) {
  return String(value || "").toLowerCase();
}

function findBase(yarn, bases) {
  const yarnBase = text(yarn.base);
  return bases.find((base) => {
    const names = [base.base, base.base_name, ...(base.aliases || [])].map(text);
    return (base.id === yarn.base_id || names.includes(yarnBase)) && (!base.brand || base.brand === yarn.brand);
  }) || {};
}

function weightRank(value) {
  const source = text(value);
  if (!source) return null;
  const matches = Object.entries(WEIGHT_RANKS).filter(([name]) => source.includes(name));
  return matches.length ? Math.min(...matches.map(([, rank]) => rank)) : null;
}

function gaugeTargetRank(pattern) {
  const rawStitches = Number(pattern.gauge?.stitches);
  const over = text(pattern.gauge?.over);
  const metricWidth = over.match(/(\d+(?:\.\d+)?)\s*(?:x|×)\s*\d+(?:\.\d+)?\s*cm/)?.[1]
    || over.match(/(?:^|\/)\s*(\d+(?:\.\d+)?)\s*cm/)?.[1];
  const imperialWidth = over.match(/(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(?:\d+(?:\.\d+)?\s*)?in/)?.[1];
  const widthCm = metricWidth ? Number(metricWidth) : imperialWidth ? Number(imperialWidth) * 2.54 : 10;
  const stitches = rawStitches ? rawStitches * 10 / widthCm : null;
  if (stitches) {
    if (stitches >= 30) return 1;
    if (stitches >= 26) return 2;
    if (stitches >= 22) return 3;
    if (stitches >= 18) return 4;
    if (stitches >= 14) return 5;
    return 6;
  }
  const categories = pattern.stash_match?.weight_categories || [];
  const ranks = categories.map(weightRank).filter(Number.isFinite);
  return ranks.length ? Math.min(...ranks) : null;
}

function parseNeedleRange(value) {
  const source = text(value);
  const mmValues = [...source.matchAll(/(\d+(?:\.\d+)?)\s*(?:-|–|to)?\s*(\d+(?:\.\d+)?)?\s*mm/g)]
    .flatMap((match) => [Number(match[1]), match[2] ? Number(match[2]) : Number(match[1])]);
  return mmValues.length ? { min: Math.min(...mmValues), max: Math.max(...mmValues) } : null;
}

function yarnNeedleRange(yarn, base) {
  if (base.recommended_needle_mm) return base.recommended_needle_mm;
  return parseNeedleRange(base.needle_size || yarn.needle_size);
}

function patternNeedle(pattern) {
  const range = parseNeedleRange(pattern.gauge?.needle || pattern.tools?.[0]);
  return range ? (range.min + range.max) / 2 : null;
}

function fiberText(yarn, base) {
  return [yarn.base, yarn.weight, ...Object.keys(yarn.fiber_content || base.fiber_content || {})].join(" ").toLowerCase();
}

function hasHalo(yarn, base) {
  const source = `${fiberText(yarn, base)} ${(yarn.texture || []).join(" ")}`;
  return ["mohair", "suri", "alpaca", "halo", "brushed", "fluffy", "teddy", "boucle"].some((term) => source.includes(term));
}

function patternNeedsHaloCompanion(pattern) {
  const source = `${pattern.recommended_yarn?.main_combination || ""} ${(pattern.stash_match?.weight_categories || []).join(" ")}`.toLowerCase();
  return source.includes("mohair") || source.includes("suri");
}

function explicitDoubleRequirement(pattern) {
  const construction = `${pattern.gauge?.yarn_held || ""} ${pattern.recommended_yarn?.construction_note || ""}`.toLowerCase();
  if (!construction.includes("double") && !construction.includes("two strands")) return null;
  return weightRank(pattern.recommended_yarn?.weight || (pattern.stash_match?.weight_categories || []).join(" "));
}

function effectivePairRank(first, second) {
  const high = Math.max(first, second);
  const difference = Math.abs(first - second);
  return high + (difference <= .5 ? 1.75 : difference <= 1.5 ? 1.25 : .75);
}

function effectiveCombinedRank(ranks) {
  return ranks.slice(1).reduce((combined, rank) => effectivePairRank(combined, rank), ranks[0]);
}

function hexRgb(value) {
  const hex = String(value || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
  return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
}

function colorDistance(yarn, target) {
  const targetRgb = hexRgb(target?.hex);
  const yarnColors = (yarn.palette_hex || []).map(hexRgb).filter(Boolean);
  if (!targetRgb || !yarnColors.length) return Number.POSITIVE_INFINITY;
  return Math.min(...yarnColors.map((rgb) => Math.sqrt(rgb.reduce((sum, value, index) => sum + (value - targetRgb[index]) ** 2, 0))));
}

function paletteYarnsFor(result, availableYarns, bases) {
  const constructions = result.pattern.recommended_yarn?.allowed_constructions || [];
  const colorRoles = Math.max(1, ...constructions.map((item) => Number(item.color_roles) || 1));
  const originalColors = result.pattern.color_themes?.original || [];
  const targetColors = result.pattern.color_themes?.recommended || [];
  const requiredColors = Math.max(colorRoles, originalColors.length || 1);
  if (requiredColors <= result.yarns.length) return result.yarns;

  const coreRank = weightRank(result.yarns[0]?.weight || (bases.get(result.yarns[0]?.id) || {}).weight);
  const compatible = availableYarns.filter((yarn) => {
    const rank = weightRank(yarn.weight || (bases.get(yarn.id) || {}).weight);
    return Number.isFinite(rank) && Math.abs(rank - coreRank) <= .75;
  });
  const selected = [...new Map(result.yarns.map((yarn) => [yarn.id, yarn])).values()];
  const unusedTargets = targetColors.slice();

  selected.forEach((yarn) => {
    if (!unusedTargets.length) return;
    const bestIndex = unusedTargets.reduce((best, target, index) =>
      colorDistance(yarn, target) < colorDistance(yarn, unusedTargets[best]) ? index : best, 0);
    unusedTargets.splice(bestIndex, 1);
  });
  while (selected.length < requiredColors) {
    const pool = compatible.filter((yarn) => !selected.some((item) => item.id === yarn.id));
    if (!pool.length) break;
    const target = unusedTargets.shift();
    pool.sort((first, second) => colorDistance(first, target) - colorDistance(second, target));
    selected.push(pool[0]);
  }
  return selected;
}

function constructionSlots(construction) {
  return (construction.components || []).flatMap((component) =>
    Array.from({ length: component.strands || 1 }, () => component));
}

function componentWeightDifference(component, rank) {
  const targets = (component.accepted_weights || []).map(weightRank).filter(Number.isFinite);
  return targets.length ? Math.min(...targets.map((target) => Math.abs(target - rank))) : 0;
}

function matchConstruction(pattern, yarns, bases) {
  const constructions = pattern.recommended_yarn?.allowed_constructions || [];
  for (const construction of constructions) {
    const slots = constructionSlots(construction);
    if (slots.length !== yarns.length) continue;

    const used = new Set();
    const assignment = [];
    const search = (slotIndex) => {
      if (slotIndex === slots.length) {
        const grouped = new Map();
        slots.forEach((slot, index) => {
          if (!slot.same_yarn_group) return;
          const ids = grouped.get(slot.same_yarn_group) || new Set();
          ids.add(assignment[index].id);
          grouped.set(slot.same_yarn_group, ids);
        });
        if ([...grouped.values()].some((ids) => ids.size !== 1)) return null;
        return assignment.slice();
      }

      const slot = slots[slotIndex];
      for (let index = 0; index < yarns.length; index += 1) {
        if (used.has(index)) continue;
        const yarn = yarns[index];
        const base = bases.get(yarn.id) || {};
        const rank = weightRank(yarn.weight || base.weight);
        if (rank === null || componentWeightDifference(slot, rank) > .75) continue;
        if (slot.texture === "halo" && !hasHalo(yarn, base)) continue;
        used.add(index);
        assignment[slotIndex] = yarn;
        const result = search(slotIndex + 1);
        if (result) return result;
        used.delete(index);
      }
      return null;
    };

    const matchedYarns = search(0);
    if (matchedYarns) {
      const differences = slots.map((slot, index) => {
        const yarn = matchedYarns[index];
        return componentWeightDifference(slot, weightRank(yarn.weight || (bases.get(yarn.id) || {}).weight));
      });
      return {
        construction,
        yarns: matchedYarns,
        difference: differences.reduce((sum, value) => sum + value, 0) / differences.length
      };
    }
  }
  return null;
}

function availableMeters(yarn, base) {
  const perUnit = yarn.yardage_m || yarn.estimated_yardage_m || base.yardage_m || base.length_m;
  const unitWeight = yarn.mini_skein_weight_g || yarn.skein_weight_g || base.skein_weight_g || base.default_skein_weight_g;
  if (perUnit && yarn.remaining_weight_g && unitWeight) {
    return perUnit * yarn.remaining_weight_g / unitWeight;
  }
  return perUnit ? perUnit * (yarn.quantity || 1) : null;
}

function collectRequiredMeters(value, result = []) {
  if (!value || typeof value !== "object") return result;
  Object.entries(value).forEach(([key, entry]) => {
    if (key.includes("yardage_m") && Number.isFinite(Number(entry))) result.push(Number(entry));
    else if (key.includes("yardage_yd") && Number.isFinite(Number(entry))) result.push(Number(entry) * .9144);
    else if (typeof entry === "object") collectRequiredMeters(entry, result);
  });
  return result;
}

function requiredMeters(pattern) {
  const yarn = pattern.recommended_yarn || {};
  if (Array.isArray(yarn.quantity_m_each_by_size)) {
    return Math.min(...yarn.quantity_m_each_by_size.map(Number).filter((value) => value > 30));
  }

  const requiredByComponent = Object.values(yarn)
    .filter((entry) => entry && typeof entry === "object" && Number.isFinite(Number(entry.required_m)))
    .map((entry) => Number(entry.required_m));
  if (requiredByComponent.length) return Math.max(...requiredByComponent);

  if (yarn.yardage_m_by_size && typeof yarn.yardage_m_by_size === "object") {
    const minimums = Object.values(yarn.yardage_m_by_size)
      .map((values) => Math.min(...[].concat(values).map(Number).filter((value) => value > 0)));
    if (minimums.length) return Math.max(...minimums);
  }
  if (yarn.yardage_yd_by_size && typeof yarn.yardage_yd_by_size === "object") {
    const minimums = Object.values(yarn.yardage_yd_by_size)
      .map((values) => Math.min(...[].concat(values).map(Number).filter((value) => value > 0)) * .9144);
    if (minimums.length) return Math.max(...minimums);
  }

  const values = collectRequiredMeters(yarn.quantity);
  const positiveValues = values.filter((value) => value > 0);
  return positiveValues.length ? Math.min(...positiveValues) : null;
}

function numericValues(value, result = []) {
  if (Number.isFinite(Number(value))) result.push(Number(value));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => numericValues(entry, result));
  return result;
}

function requiredGrams(pattern) {
  const yarn = pattern.recommended_yarn || {};
  const prioritizedKeys = ["quantity_total_g_by_size", "total_min_g", "estimated_total_weight_g", "total_weight_g"];
  for (const key of prioritizedKeys) {
    const values = numericValues(yarn.quantity?.[key] ?? yarn[key]).filter((value) => value > 0);
    if (values.length) return Math.min(...values);
  }

  const values = [];
  const collect = (value) => {
    if (!value || typeof value !== "object") return;
    Object.entries(value).forEach(([key, entry]) => {
      if (/quantity_g_by_size|pattern_quantity_g_by_size|estimated_weight_g/i.test(key)) numericValues(entry, values);
      else if (typeof entry === "object") collect(entry);
    });
  };
  collect(yarn);
  const positiveValues = values.filter((value) => value > 0);
  return positiveValues.length ? Math.min(...positiveValues) : null;
}

function availableGrams(yarn, base) {
  if (Number.isFinite(Number(yarn.remaining_weight_g))) return Number(yarn.remaining_weight_g);
  const unitWeight = yarn.mini_skein_weight_g || yarn.skein_weight_g || base.skein_weight_g || base.default_skein_weight_g;
  return unitWeight ? Number(unitWeight) * Number(yarn.quantity || 1) : null;
}

function quantityStatus(yarns, bases, neededMeters, neededGrams) {
  if (!neededMeters && !neededGrams) return { passes: true, known: false };
  if (!neededMeters && neededGrams) {
    const availability = yarns.map((yarn) => availableGrams(yarn, bases.get(yarn.id) || {}));
    if (availability.some((value) => value === null)) return { passes: true, known: false };
    const uniqueAvailability = [...new Map(yarns.map((yarn, index) => [yarn.id, availability[index]])).values()];
    return { passes: uniqueAvailability.reduce((sum, value) => sum + value, 0) >= neededGrams, known: true };
  }
  const availability = yarns.map((yarn) => availableMeters(yarn, bases.get(yarn.id) || {}));
  if (availability.some((value) => value === null)) return { passes: true, known: false };
  if (yarns.length === 1) return { passes: availability[0] >= neededMeters, known: true };
  if (yarns.every((yarn) => yarn.id === yarns[0].id)) {
    return { passes: availability[0] >= neededMeters * yarns.length, known: true };
  }
  return { passes: availability.every((value) => value >= neededMeters), known: true };
}

function colorRoleCount(pattern) {
  return Math.max(0, ...(pattern.recommended_yarn?.allowed_constructions || [])
    .map((construction) => Number(construction.color_roles) || 0));
}

function candidate(pattern, yarns, bases, preferences) {
  if (preferences.craft && preferences.craft !== "all" && pattern.craft !== preferences.craft) return null;
  if (preferences.itemGroup && preferences.itemGroup !== "all"
    && !ITEM_GROUPS[preferences.itemGroup]?.has(text(pattern.category))) return null;
  const targetRank = gaugeTargetRank(pattern);
  const resolvedWeights = yarns.map((yarn) => yarn.weight || (bases.get(yarn.id) || {}).weight);
  const ranks = resolvedWeights.map(weightRank);
  if (targetRank === null || ranks.some((rank) => rank === null)) return null;
  const constructionMatch = matchConstruction(pattern, yarns, bases);
  const hasConstructionRules = Boolean(pattern.recommended_yarn?.allowed_constructions?.length);
  if (hasConstructionRules && !constructionMatch) return null;
  if (constructionMatch) yarns = constructionMatch.yarns;
  const actualRank = yarns.length === 1 ? ranks[0] : effectiveCombinedRank(ranks);
  const gaugeDifference = constructionMatch?.difference ?? Math.abs(targetRank - actualRank);
  if (gaugeDifference > .8) return null;

  const requiredDoubleRank = hasConstructionRules ? null : explicitDoubleRequirement(pattern);
  if (requiredDoubleRank !== null) {
    if (yarns.length !== 2 || ranks.some((rank) => Math.abs(rank - requiredDoubleRank) > .75)) return null;
  }

  if (!hasConstructionRules && patternNeedsHaloCompanion(pattern) && yarns.length === 2) {
    const haloCount = yarns.filter((yarn) => hasHalo(yarn, bases.get(yarn.id) || {})).length;
    if (haloCount !== 1) return null;
  }

  const neededMeters = requiredMeters(pattern);
  const neededGrams = neededMeters ? null : requiredGrams(pattern);
  const availabilityMeters = yarns.map((yarn) => availableMeters(yarn, bases.get(yarn.id) || {}));
  const availabilityGrams = yarns.map((yarn) => availableGrams(yarn, bases.get(yarn.id) || {}));
  const usesColorPool = colorRoleCount(pattern) > 1;
  const quantity = usesColorPool ? { passes: true, known: false } : quantityStatus(yarns, bases, neededMeters, neededGrams);
  if (preferences.requireQuantity !== false && !quantity.passes) return null;
  const targetNeedle = patternNeedle(pattern);
  if (Number.isFinite(preferences.needleMm)
    && (!targetNeedle || Math.abs(targetNeedle - preferences.needleMm) > .26)) return null;
  const needleRanges = yarns.map((yarn) => yarnNeedleRange(yarn, bases.get(yarn.id) || {}));
  const knownNeedleRanges = targetNeedle ? needleRanges.filter(Boolean) : [];
  const matchingNeedleRanges = targetNeedle
    ? knownNeedleRanges.filter((range) => targetNeedle >= range.min - .75 && targetNeedle <= range.max + 1.5)
    : [];
  const needlePass = !targetNeedle || !knownNeedleRanges.length || matchingNeedleRanges.length > 0;
  if (!needlePass) return null;

  const weightScore = Math.max(0, 40 * (1 - gaugeDifference / .8));
  const needleScore = targetNeedle ? 20 * (matchingNeedleRanges.length / yarns.length) : 0;
  const quantityScore = quantity.known && quantity.passes ? 15 : 0;
  const compatibilityScore = weightScore + needleScore + quantityScore;
  const totalScore = compatibilityScore / 75 * 100;
  return {
    pattern,
    yarns,
    score: totalScore,
    match: constructionMatch?.construction.mode || (yarns.length === 1 ? "single" : yarns[0].id === yarns[1].id ? "double-same" : "double-mixed"),
    construction: constructionMatch?.construction || null,
    confidence: !constructionMatch?.construction.swatch_required
      && quantity.known
      && matchingNeedleRanges.length === yarns.length ? "high" : "swatch",
    gaugeDifference,
    quantityKnown: quantity.known,
    diagnostics: {
      targetRank,
      actualRank,
      yarnRanks: ranks,
      yarnWeightLabels: resolvedWeights,
      targetNeedle,
      needleRanges,
      matchingNeedleCount: matchingNeedleRanges.length,
      requiredMeters: neededMeters,
      requiredGrams: neededGrams,
      availabilityMeters,
      availabilityGrams,
      quantityMode: usesColorPool ? "pooled-colors" : "per-yarn",
      compatibilityScore,
      weightScore,
      needleScore,
      quantityScore,
      filters: { ...preferences },
      totalScore,
      maxCompatibilityScore: 75,
      maxTotalScore: 100
    }
  };
}

export function buildRecommendations({ yarns, patterns, yarnBases, preferences }) {
  const bases = new Map(yarns.map((yarn) => [yarn.id, findBase(yarn, yarnBases)]));
  const enriched = yarns.filter((yarn) => weightRank(yarn.weight || bases.get(yarn.id)?.weight) !== null);
  const recommendations = [];

  patterns.forEach((pattern) => {
    const constructions = pattern.recommended_yarn?.allowed_constructions || [];
    const seen = new Set();
    const addCandidate = (selected) => {
      const key = selected.map((yarn) => yarn.id).sort().join("|");
      if (seen.has(key)) return;
      seen.add(key);
      const result = candidate(pattern, selected, bases, preferences);
      if (result) {
        result.paletteYarns = paletteYarnsFor(result, enriched, bases);
        if (result.diagnostics.quantityMode === "pooled-colors") {
          const uniqueYarns = [...new Map(result.paletteYarns.map((yarn) => [yarn.id, yarn])).values()];
          const availability = uniqueYarns.map((yarn) => availableMeters(yarn, bases.get(yarn.id) || {}));
          const required = Number(pattern.recommended_yarn?.quantity?.total_yardage_m) || result.diagnostics.requiredMeters;
          const known = Boolean(required) && availability.every(Number.isFinite);
          const passes = !known || availability.reduce((sum, value) => sum + value, 0) >= required;
          if (preferences.requireQuantity !== false && !passes) return;
          result.quantityKnown = known;
          result.diagnostics.requiredMeters = required;
          result.diagnostics.availabilityMeters = availability;
          result.diagnostics.quantityScore = known && passes ? 15 : 0;
          result.diagnostics.compatibilityScore = result.diagnostics.weightScore + result.diagnostics.needleScore + result.diagnostics.quantityScore;
          result.diagnostics.totalScore = result.diagnostics.compatibilityScore / result.diagnostics.maxCompatibilityScore * 100;
          result.score = result.diagnostics.totalScore;
        }
        recommendations.push(result);
      }
    };

    if (constructions.length) {
      constructions.forEach((construction) => {
        const components = construction.components || [];
        const choose = (componentIndex, selected) => {
          if (componentIndex === components.length) {
            addCandidate(selected);
            return;
          }
          const component = components[componentIndex];
          enriched.forEach((yarn) => {
            choose(componentIndex + 1, [
              ...selected,
              ...Array.from({ length: component.strands || 1 }, () => yarn)
            ]);
          });
        };
        choose(0, []);
      });
      return;
    }

    enriched.forEach((yarn) => addCandidate([yarn]));
    for (let first = 0; first < enriched.length; first += 1) {
      for (let second = first; second < enriched.length; second += 1) addCandidate([enriched[first], enriched[second]]);
    }
  });

  const ranked = recommendations.sort((first, second) => second.score - first.score);
  const shortlist = [];
  const patternBuckets = new Map();
  ranked.forEach((item) => {
    const bucket = patternBuckets.get(item.pattern.id) || { single: 0, paired: 0 };
    const kind = item.yarns.length === 1 ? "single" : "paired";
    if (bucket[kind] >= 2) return;
    bucket[kind] += 1;
    patternBuckets.set(item.pattern.id, bucket);
    shortlist.push(item);
  });
  return shortlist.sort((first, second) => second.score - first.score);
}

export const recommendationInternals = { weightRank, gaugeTargetRank, effectivePairRank, parseNeedleRange, matchConstruction, requiredMeters, requiredGrams };
