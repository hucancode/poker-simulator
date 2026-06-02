export const RANKS = "AKQJT98765432";
export const RANK_TO_IDX = Object.fromEntries(
  RANKS.split("").map((r, i) => [r, i]),
);

const CARD_RANKS = "23456789TJQKA";
const CARD_RANK_TO_IDX = Object.fromEntries(
  CARD_RANKS.split("").map((r, i) => [r, i]),
);

function cardId(rankChar, suitIdx) {
  return CARD_RANK_TO_IDX[rankChar] * 4 + suitIdx;
}

export function cellToConcreteCombos(cellIdx, deadSet) {
  const r = Math.floor(cellIdx / 13);
  const c = cellIdx % 13;
  const highRank = RANKS[Math.min(r, c)];
  const lowRank = RANKS[Math.max(r, c)];
  const out = [];
  if (r === c) {
    for (let s1 = 0; s1 < 4; s1++) {
      for (let s2 = s1 + 1; s2 < 4; s2++) {
        const a = cardId(highRank, s1);
        const b = cardId(highRank, s2);
        if (!deadSet.has(a) && !deadSet.has(b)) out.push([a, b]);
      }
    }
  } else if (r < c) {
    for (let s = 0; s < 4; s++) {
      const a = cardId(highRank, s);
      const b = cardId(lowRank, s);
      if (!deadSet.has(a) && !deadSet.has(b)) out.push([a, b]);
    }
  } else {
    for (let s1 = 0; s1 < 4; s1++) {
      for (let s2 = 0; s2 < 4; s2++) {
        if (s1 === s2) continue;
        const a = cardId(highRank, s1);
        const b = cardId(lowRank, s2);
        if (!deadSet.has(a) && !deadSet.has(b)) out.push([a, b]);
      }
    }
  }
  return out;
}

export function expandNotationToCombos(notation, deadCards) {
  const deadSet = new Set(deadCards);
  const cells = cellsFromNotation(notation);
  const out = [];
  for (const idx of cells) {
    out.push(...cellToConcreteCombos(idx, deadSet));
  }
  return out;
}

export function cellIndex(r, c) {
  return r * 13 + c;
}

export function cellLabel(r, c) {
  const highRank = RANKS[Math.min(r, c)];
  const lowRank = RANKS[Math.max(r, c)];
  if (r === c) return highRank + highRank;
  if (r < c) return highRank + lowRank + "s";
  return highRank + lowRank + "o";
}

export function cellKind(r, c) {
  if (r === c) return "pair";
  if (r < c) return "suited";
  return "offsuit";
}

export function notationFromCells(selected) {
  const tokens = [];
  for (const i of selected) {
    const r = Math.floor(i / 13);
    const c = i % 13;
    tokens.push(cellLabel(r, c));
  }
  return tokens.join(",");
}

function addPairCell(rank, cells) {
  const i = RANK_TO_IDX[rank];
  if (i === undefined) return;
  cells.add(i * 13 + i);
}

function addCellByRanks(rA, rB, suit, cells) {
  const a = RANK_TO_IDX[rA];
  const b = RANK_TO_IDX[rB];
  if (a === undefined || b === undefined) return;
  const hi = Math.min(a, b);
  const lo = Math.max(a, b);
  if (suit === "s") cells.add(hi * 13 + lo);
  else cells.add(lo * 13 + hi);
}

function addBase(r1, r2, sd, cells) {
  if (r1 === r2) {
    addPairCell(r1, cells);
    return;
  }
  if (sd === "any") {
    addCellByRanks(r1, r2, "s", cells);
    addCellByRanks(r1, r2, "o", cells);
  } else {
    addCellByRanks(r1, r2, sd, cells);
  }
}

function addPlus(r1, r2, sd, cells) {
  if (r1 === r2) {
    const start = RANK_TO_IDX[r1];
    if (start === undefined) return;
    for (let i = 0; i <= start; i++) addPairCell(RANKS[i], cells);
    return;
  }
  const a = RANK_TO_IDX[r1];
  const b = RANK_TO_IDX[r2];
  if (a === undefined || b === undefined) return;
  const hiIdx = Math.min(a, b);
  const loIdx = Math.max(a, b);
  const hi = RANKS[hiIdx];
  for (let i = loIdx; i > hiIdx; i--) addBase(hi, RANKS[i], sd, cells);
}

function addRange(r1, r2, sd, endTok, cells) {
  if (endTok.length < 2) return;
  const e1 = endTok[0];
  const e2 = endTok[1];
  if (r1 === r2 && e1 === e2) {
    const a = RANK_TO_IDX[r1];
    const b = RANK_TO_IDX[e1];
    if (a === undefined || b === undefined) return;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    for (let i = lo; i <= hi; i++) addPairCell(RANKS[i], cells);
    return;
  }
  const a1 = RANK_TO_IDX[r1];
  const b1 = RANK_TO_IDX[r2];
  const a2 = RANK_TO_IDX[e1];
  const b2 = RANK_TO_IDX[e2];
  if ([a1, b1, a2, b2].some((x) => x === undefined)) return;
  const hi1 = Math.min(a1, b1);
  const lo1 = Math.max(a1, b1);
  const hi2 = Math.min(a2, b2);
  const lo2 = Math.max(a2, b2);
  if (hi1 !== hi2) return;
  const hi = RANKS[hi1];
  const loA = Math.min(lo1, lo2);
  const loB = Math.max(lo1, lo2);
  for (let i = loA; i <= loB; i++) addBase(hi, RANKS[i], sd, cells);
}

const SUIT_CHARS = "scdh";

function isExplicitCombo(token) {
  if (token.length !== 4) return false;
  const r1 = token[0].toUpperCase();
  const s1 = token[1].toLowerCase();
  const r2 = token[2].toUpperCase();
  const s2 = token[3].toLowerCase();
  return (
    RANK_TO_IDX[r1] !== undefined &&
    RANK_TO_IDX[r2] !== undefined &&
    SUIT_CHARS.includes(s1) &&
    SUIT_CHARS.includes(s2)
  );
}

function addToken(token, cells) {
  token = token.trim();
  if (!token) return;
  if (isExplicitCombo(token)) {
    const r1 = token[0].toUpperCase();
    const r2 = token[2].toUpperCase();
    const s1 = token[1].toLowerCase();
    const s2 = token[3].toLowerCase();
    if (r1 === r2) {
      addPairCell(r1, cells);
      return;
    }
    addCellByRanks(r1, r2, s1 === s2 ? "s" : "o", cells);
    return;
  }
  if (token.length < 2) return;
  const r1 = token[0].toUpperCase();
  const r2 = token[1].toUpperCase();
  let tail = token.slice(2);
  let sd = "any";
  if (tail.startsWith("s")) {
    sd = "s";
    tail = tail.slice(1);
  } else if (tail.startsWith("o")) {
    sd = "o";
    tail = tail.slice(1);
  }
  if (!tail) {
    addBase(r1, r2, sd, cells);
    return;
  }
  if (tail === "+") {
    addPlus(r1, r2, sd, cells);
    return;
  }
  if (tail.startsWith("-")) {
    addRange(r1, r2, sd, tail.slice(1).toUpperCase(), cells);
  }
}

export function cellsFromNotation(notation) {
  const cells = new Set();
  if (!notation) return cells;
  for (const token of notation.split(",")) addToken(token, cells);
  return cells;
}

export const PRESETS = {
  any: () => {
    const s = new Set();
    for (let i = 0; i < 169; i++) s.add(i);
    return s;
  },
  premium: () => cellsFromNotation("QQ+,AKs,AKo"),
  broadway: () => cellsFromNotation("TT+,ATs+,KTs+,QTs+,JTs,ATo+,KTo+,QTo+,JTo"),
  pairs: () => cellsFromNotation("22+"),
  suited_connectors: () =>
    cellsFromNotation("54s,65s,76s,87s,98s,T9s,JTs,QJs,KQs"),
  clear: () => new Set(),
};
