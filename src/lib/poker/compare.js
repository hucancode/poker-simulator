import {
  straightFlush,
  fourOfAKind,
  fullHouse,
  flush,
  straight,
  threeOfAKind,
  twoPair,
  pair,
} from "./special-hands.js";
import {
  handArrayToMask,
  handArrayToText,
  handMaskToArray,
  handMaskToText,
  handTextToMask,
} from "./cards.js";
// import { getCombinations } from "./combinations.js";

export const A_WIN = 1;
export const B_WIN = -1;
export const TIE = 0;

const RANK_2 = 0n;
const RANK_3 = 1n;
const RANK_4 = 2n;
const RANK_5 = 3n;
const RANK_6 = 4n;
const RANK_7 = 5n;
const RANK_8 = 6n;
const RANK_9 = 7n;
const RANK_10 = 8n;
const RANK_J = 9n;
const RANK_Q = 10n;
const RANK_K = 11n;
const RANK_A = 12n;
const RANK_MAX = 13n;
const SUIT_SPADE = 0n;
const SUIT_CLUB = 1n;
const SUIT_DIAMOND = 2n;
const SUIT_HEART = 3n;
const SUIT_MAX = 4n;

export const STRAIGHT_FLUSH = 0;
export const FOUR_OF_A_KIND = 1;
export const FULL_HOUSE = 2;
export const FLUSH = 3;
export const STRAIGHT = 4;
export const THREE_OF_A_KIND = 5;
export const TWO_PAIR = 6;
export const PAIR = 7;
export const HIGH_CARD = 8;

const BIT_1111 = (1n << 4n) - 1n;
const rankMask = Array(13).fill().map((_, i) => (BIT_1111 << (BigInt(i) * SUIT_MAX)));

function compareHighCard(maskA, maskB) {
  for (var i = RANK_A; i >= RANK_2; i--) {
    const a = (maskA & rankMask[i]) != 0;
    const b  = (maskB & rankMask[i]) != 0;
    if (a && b) continue;
    if (a) return A_WIN;
    if (b) return B_WIN;
  }
  return TIE;
}

function binarySearch(arr, x) {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    let m = Math.floor((l + r) / 2);
    if (arr[m] === x) {
      return true;
    } else if (arr[m] < x) {
      l = m + 1;
    } else {
      r = m - 1;
    }
  }
  return false;
}

function match(arr, mask) {
  for (let order = 0; order < arr.length; order++) {
    for (const pattern of arr[order]) {
      if (pattern == (mask & pattern)) {
        return {
          pattern,
          order,
        };
      }
    }
  }
  return null;
}

function getHighestBit(mask, count = 1) {
  let ret = 0n;
  let k = 1n << 51n; // 100000000...0
  while (k != 0n) {
    if ((mask & k) == k) {
      ret |= k;
      count--;
      if (count == 0) {
        break;
      }
    }
    k = k >> 1n;
  }
  return ret;
}

// given 7 cards, return the best combination consist of 5 cards
export function getStrongest5(mask) {
  mask = handArrayToMask(mask);
  let ret;
  ret = match(straightFlush, mask);
  if (ret) {
    return {
      rank: STRAIGHT_FLUSH,
      order: ret.order,
      unranked: 0n,
      mask: ret.pattern,
    };
  }
  ret = match(fourOfAKind, mask);
  if (ret) {
    const high = mask & ~ret.pattern;
    return {
      rank: FOUR_OF_A_KIND,
      order: ret.order,
      unranked: getHighestBit(high),
      mask: ret.pattern,
    };
  }
  ret = match(fullHouse, mask);
  if (ret) {
    return {
      rank: FULL_HOUSE,
      order: ret.order,
      unranked: 0n,
      mask: ret.pattern,
    };
  }
  ret = match(flush, mask);
  if (ret) {
    return {
      rank: FLUSH,
      order: ret.order,
      unranked: 0n,
      mask: ret.pattern,
    };
  }
  ret = match(straight, mask);
  if (ret) {
    return {
      rank: STRAIGHT,
      order: ret.order,
      unranked: 0n,
      mask: ret.pattern,
    };
  }
  ret = match(threeOfAKind, mask);
  if (ret) {
    const high = mask & ~ret.pattern;
    return {
      rank: THREE_OF_A_KIND,
      order: ret.order,
      unranked: getHighestBit(high, 2),
      mask: ret.pattern,
    };
  }
  ret = match(twoPair, mask);
  if (ret) {
    const high = mask & ~ret.pattern;
    return {
      rank: TWO_PAIR,
      order: ret.order,
      unranked: getHighestBit(high),
      mask: ret.pattern,
    };
  }
  ret = match(pair, mask);
  if (ret) {
    const high = mask & ~ret.pattern;
    return {
      rank: PAIR,
      order: ret.order,
      unranked: getHighestBit(high, 3),
      mask: ret.pattern,
    };
  }
  return {
    rank: HIGH_CARD,
    order: 0,
    unranked: getHighestBit(mask, 5),
    mask: 0n,
  };
}

export function compare(handA, handB) {
  if (handA.rank < handB.rank) return A_WIN;
  if (handB.rank < handA.rank) return B_WIN;
  if (handA.order < handB.order) return A_WIN;
  if (handB.order < handA.order) return B_WIN;
  return compareHighCard(handA.unranked, handB.unranked);
}

export function compare7(arrayA, arrayB) {
  // console.log("compare 7", arrayA, arrayB);
  const bestA = getStrongest5(arrayA);
  const bestB = getStrongest5(arrayB);
  // console.log("best A", bestA.rank, handMaskToText(bestA.mask | bestA.unranked));
  // console.log("best B", bestB.rank, handMaskToText(bestB.mask | bestB.unranked));
  const ret = compare(bestA, bestB);
  return ret;
}
