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
import { handArrayToMask, handMaskToText, handTextToMask } from "./cards.js";
import { getCombinations } from "./combinations.js";

const BIT_1111 = (1n << 4n) - 1n;
export const A_WIN = 1;
export const B_WIN = -1;
export const TIE = 0;

const RANK_2 = 0;
const RANK_3 = 1;
const RANK_4 = 2;
const RANK_5 = 3;
const RANK_6 = 4;
const RANK_7 = 5;
const RANK_8 = 6;
const RANK_9 = 7;
const RANK_10 = 8;
const RANK_J = 9;
const RANK_Q = 10;
const RANK_K = 11;
const RANK_A = 12;
const RANK_MAX = 13;
const SUIT_SPADE = 0;
const SUIT_CLUB = 1;
const SUIT_DIAMOND = 2;
const SUIT_HEART = 3;
const SUIT_MAX = 4;

const STRAIGHT_FLUSH = 9;
const FOUR_OF_A_KIND = 8;
const FULL_HOUSE = 7;
const FLUSH = 6;
const STRAIGHT = 5;
const THREE_OF_A_KIND = 4;
const TWO_PAIR = 3;
const PAIR = 2;
const HIGH_CARD = 1;

let rankMask = Array(RANK_MAX);
rankMask.fill(0n);
for (var i = RANK_2; i < RANK_MAX; i++) {
  for (var j = SUIT_SPADE; j < SUIT_MAX; j++) {
    const d = i * SUIT_MAX + j;
    const x = 1n << BigInt(d);
    rankMask[i] |= x;
  }
}

function compareHighCard(maskA, maskB) {
  for (var i = RANK_A; i >= RANK_2; i--) {
    const a = hasCardRank(maskA, i);
    const b = hasCardRank(maskB, i);
    if (a && b) continue;
    if (a) return A_WIN;
    if (b) return B_WIN;
  }
  return TIE;
}

function compareFlush(maskA, maskB) {
  return compareHighCard(maskA, maskB);
}

function hasCardRank(mask, rank) {
  return (BigInt(mask) & BigInt(rankMask[rank])) != 0;
}

function countDuplicate(mask, rank) {
  let ret = 0;
  for (var j = SUIT_SPADE; j <= SUIT_HEART; j++)
    if ((BigInt(mask) & (1n << BigInt(rank * SUIT_MAX + j))) != 0) ret++;
  return ret;
}

function compareStraight(maskA, maskB) {
  const lowAceA = hasCardRank(maskA, RANK_2) && hasCardRank(maskA, RANK_A);
  const lowAceB = hasCardRank(maskB, RANK_2) && hasCardRank(maskB, RANK_A);
  if (!lowAceA && !lowAceB) return compareHighCard(maskA, maskB);
  if (lowAceA) return B_WIN;
  if (lowAceB) return A_WIN;
  return TIE;
}

function compareFullHouse(maskA, maskB) {
  for (var i = RANK_A; i >= RANK_2; i--) {
    const a = countDuplicate(maskA, i);
    const b = countDuplicate(maskB, i);
    if (a == 3 && b != 3) return A_WIN;
    if (b == 3 && a != 3) return B_WIN;
  }
  for (var i = RANK_A; i >= RANK_2; i--) {
    const a = countDuplicate(maskA, i);
    const b = countDuplicate(maskB, i);
    if (a == 2 && b != 2) return A_WIN;
    if (b == 2 && a != 2) return B_WIN;
  }
  return TIE;
}

function compareFourOfAKind(maskA, maskB) {
  for (var i = RANK_A; i >= RANK_2; i--) {
    const a = countDuplicate(maskA, i);
    const b = countDuplicate(maskB, i);
    if (a == 4 && b != 4) return A_WIN;
    if (b == 4 && a != 4) return B_WIN;
  }
  return compareHighCard(maskA, maskB);
}

function compareThreeOfAKind(maskA, maskB) {
  for (var i = RANK_A; i >= RANK_2; i--) {
    const a = countDuplicate(maskA, i);
    const b = countDuplicate(maskB, i);
    if (a == 3 && b != 3) return A_WIN;
    if (b == 3 && a != 3) return B_WIN;
  }
  return compareHighCard(maskA, maskB);
}

function compareTwoPairs(maskA, maskB) {
  for (var i = RANK_A; i >= RANK_2; i--) {
    const a = countDuplicate(maskA, i);
    const b = countDuplicate(maskB, i);
    if (a == 2 && b != 2) return A_WIN;
    if (b == 2 && a != 2) return B_WIN;
  }
  return compareHighCard(maskA, maskB);
}

function comparePair(maskA, maskB) {
  for (var i = RANK_A; i >= RANK_2; i--) {
    const a = countDuplicate(maskA, i);
    const b = countDuplicate(maskB, i);
    if (a == 2 && b != 2) return A_WIN;
    if (b == 2 && a != 2) return B_WIN;
  }
  return compareHighCard(maskA, maskB);
}

function checkBit(mask, x) {
  return (BigInt(mask) & BigInt(x)) == BigInt(mask);
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

export function evaluate(mask) {
  if (binarySearch(straightFlush, mask)) {
    return STRAIGHT_FLUSH;
  }
  if (fourOfAKind.some((e) => checkBit(e, mask))) {
    return FOUR_OF_A_KIND;
  }
  if (binarySearch(fullHouse, mask)) {
    return FULL_HOUSE;
  }
  if (binarySearch(flush, mask)) {
    return FLUSH;
  }
  if (binarySearch(straight, mask)) {
    return STRAIGHT;
  }
  if (threeOfAKind.some((e) => checkBit(e, mask))) {
    return THREE_OF_A_KIND;
  }
  if (twoPair.some((e) => checkBit(e, mask))) {
    return TWO_PAIR;
  }
  if (pair.some((e) => checkBit(e, mask))) {
    return PAIR;
  }
  return HIGH_CARD;
}

export function compare(handA, handB) {
  if (handA.rank > handB.rank) return A_WIN;
  if (handB.rank > handA.rank) return B_WIN;
  if (handA.rank == STRAIGHT_FLUSH)
    return compareStraight(handA.mask, handB.mask);
  if (handA.rank == FOUR_OF_A_KIND)
    return compareFourOfAKind(handA.mask, handB.mask);
  if (handA.rank == FULL_HOUSE) return compareFullHouse(handA.mask, handB.mask);
  if (handA.rank == FLUSH) return compareFlush(handA.mask, handB.mask);
  if (handA.rank == STRAIGHT) return compareStraight(handA.mask, handB.mask);
  if (handA.rank == THREE_OF_A_KIND)
    return compareThreeOfAKind(handA.mask, handB.mask);
  if (handA.rank == TWO_PAIR) return compareTwoPairs(handA.mask, handB.mask);
  if (handA.rank == PAIR) return comparePair(handA.mask, handB.mask);
  return compareHighCard(handA.mask, handB.mask);
}

function getBestCombination(arr) {
  const comb = getCombinations(arr, 5).map((e) => {
    const mask = handArrayToMask(e);
    const rank = evaluate(mask);
    return { mask, rank };
  });
  // console.log(comb.map(e => handMaskToText(e)));
  return comb.reduce((r, v) => (v.rank > r.rank ? v : r), comb[0]);
}

export function compare7(arrayA, arrayB) {
  // console.log("compare 7", arrayA, arrayB);
  const bestA = getBestCombination(arrayA);
  const bestB = getBestCombination(arrayB);
  // console.log("best A", handMaskToText(bestA));
  // console.log("best B", handMaskToText(bestB));
  return compare(bestA, bestB);
}

let handRanks = [];

export function precomputeHandRank() {
  let usedCard = 0;
  let mask = 0n;
  let st = [];
  for (var c = 0; c < 52; c++) {
    st.push(c);
  }
  while (st.length > 0) {
    const c = st[st.length - 1];
    st.pop();
    if (c < 0) {
      usedCard--;
      mask ^= 1n << BigInt(-c);
      continue;
    }
    usedCard++;
    mask ^= 1n << BigInt(c);
    if (usedCard == 5) {
      handRanks.push({
        mask: Number(mask),
        rank: evaluate(mask),
      });
      mask ^= 1n << BigInt(c);
      usedCard--;
      continue;
    }
    st.push(-c);
    for (var next = c + 1; next < 52; next++) {
      st.push(next);
    }
  }
  console.log("precompute done");
}
