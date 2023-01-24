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
  let v = BigInt(mask); // need big int to use 64bit bit shift
  for (let i = 0n; i < 52; i++) {
    if (((v >> i) & 1n) != 0) {
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
  return Number(ret);
}

export function handTextToArray(text) {
  let ret = [];
  if (!text) {
    return ret;
  }
  for (let i = 0; i < text.length; i += 2) {
    const r = ranks.indexOf(text[i].toUpperCase());
    const s = suits.indexOf(text[i + 1].toLowerCase());
    let v = r >= 0 && s >= 0 ? r * 4 + s : -1;
    ret.push(v);
  }
  return ret;
}

export function handTextToMask(text) {
  return handArrayToMask(handTextToArray(text));
}

export function handMaskToText(mask) {
  return handArrayToText(handMaskToArray(mask));
}
