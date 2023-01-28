export const ranks = "23456789TJQKA";
export const readableRanks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
export const suits = "scdh";
export const suitSymbols = "♠♣♦♥";

export function cardIdToText(i) {
  return ranks[Math.floor(i / 4)] + suits[i % 4];
}
export function handMaskToArray(mask) {
  let ret = [];
  for (let i = 0n; i < 52n; i++) {
    if ((mask & (1n << i)) != 0) {
      ret.push(Number(i));
    }
  }
  return ret;
}

export function handArrayToText(cards) {
  let ret = "";
  for (const card of cards) {
    const r = Math.floor(card / 4);
    const s = card % 4;
    ret += ranks[r];
    ret += suits[s];
  }
  return ret;
}

export function handArrayToMask(cards) {
  let ret = 0n;
  for (const card of cards) {
    ret |= 1n << BigInt(card);
  }
  return ret;
}

export function handTextToArray(text) {
  let ret = [];
  if (!text) {
    return ret;
  }
  for (let i = 0; i < text.length; i += 2) {
    const r = ranks.indexOf(text[i].toUpperCase());
    const s = suits.indexOf(text[i + 1].toLowerCase());
    if (r < 0 || s < 0) {
      break;
    }
    ret.push(r * 4 + s);
  }
  return ret;
}

export function handTextToMask(text) {
  return handArrayToMask(handTextToArray(text));
}

export function handMaskToText(mask) {
  return handArrayToText(handMaskToArray(mask));
}

export function rangeTextToArray(text) {
  console.log("hand range text to array", text);
  // QQ = 2Q
  // QQ+ = QQ,KK,AA
  // Q9 = Q9 suited or not
  // Q9+ = Q9, QT, QJ, QQ, QK, QA suited or not
  // Q9s = Q9 suited
  // Q9o = Q9 off-suited
  // Q9s+ = Q9, QT, QJ, QQ, QK, QA suited
  // Q9o+ = Q9, QT, QJ, QQ, QK, QA off-suited
  let ret = [];
  if (text.length < 2) {
    return ret;
  }
  let i = 0;
  const r1 = ranks.indexOf(text[i++].toUpperCase());
  const r2 = ranks.indexOf(text[i++].toUpperCase());
  if (r1 < 0 || r2 < 0) {
    return ret;
  }
  console.log("r1", r1, "r2", r2);
  let paired = r1 == r2;
  let suited = false;
  let offSuited = false;
  let extended = false;
  if (text.length > i && text[i] == "s") {
    suited = true;
    i++;
  } else if (text.length > i && text[i] == "o") {
    offSuited = true;
    i++;
  }
  if (text.length > i && text[i] == "+") {
    extended = true;
  }
  if (paired) {
    for (let r = r1; r < 13; r++) {
      for (let s1 = 0; s1 < 4; s1++) {
        for (let s2 = s1 + 1; s2 < 4; s2++) {
          ret.push([r * 4 + s1, r * 4 + s2]);
        }
      }
      if (!extended) {
        break;
      }
    }
    return ret;
  }
  for (let r = r2; r < 13; r++) {
    for (let s1 = 0; s1 < 4; s1++) {
      for (let s2 = 0; s2 < 4; s2++) {
        if (suited && s1 != s2) {
          continue;
        }
        if (offSuited && s1 == s2) {
          continue;
        }
        ret.push([r1 * 4 + s1, r * 4 + s2]);
      }
    }
    if (!extended) {
      break;
    }
  }
  return ret;
}
