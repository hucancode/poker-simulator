// generate straight
const straight = [];
const straightFlush = [];

for (var top = 12n; top >= 3n; top--) {
  const arr = [];
  const arrST = [];
  for (var s0 = 0n; s0 < 4n; s0++) {
    for (var s1 = 0n; s1 < 4n; s1++) {
      for (var s2 = 0n; s2 < 4n; s2++) {
        for (var s3 = 0n; s3 < 4n; s3++) {
          for (var s4 = 0n; s4 < 4n; s4++) {
            const i = top * 4n + s0;
            const j = (top - 1n) * 4n + s1;
            const k = (top - 2n) * 4n + s2;
            const l = (top - 3n) * 4n + s3;
            // special case - low ace
            const m = (top == 3n ? 12n : top - 4n) * 4n + s4;
            const mask =
              (1n << i) | (1n << j) | (1n << k) | (1n << l) | (1n << m);
            if (s0 == s1 && s1 == s2 && s2 == s3 && s3 == s4) {
              arrST.push(mask);
            } else {
              arr.push(mask);
            }
          }
        }
      }
    }
  }
  straight.push(arr);
  straightFlush.push(arrST);
}

// generate flush
const flush = [];
for (var r0 = 12n; r0 >= 4n; r0--) {
  for (var r1 = r0 - 1n; r1 >= 3n; r1--) {
    for (var r2 = r1 - 1n; r2 >= 2n; r2--) {
      for (var r3 = r2 - 1n; r3 >= 1n; r3--) {
        for (var r4 = r3 - 1n; r4 >= 0n; r4--) {
          const arr = [];
          for (var suit = 0n; suit < 4n; suit++) {
            const i = r0 * 4n + suit;
            const j = r1 * 4n + suit;
            const k = r2 * 4n + suit;
            const l = r3 * 4n + suit;
            const m = r4 * 4n + suit;
            const mask =
              (1n << i) | (1n << j) | (1n << k) | (1n << l) | (1n << m);
            arr.push(mask);
          }
          flush.push(arr);
        }
      }
    }
  }
}

const BIT_1111 = (1n << 4n) - 1n;

// generate four of a kind
const fourOfAKind = [];
for (var r = 12n; r >= 0; r--) {
  const mask = BIT_1111 << (r * 4n);
  fourOfAKind.push([mask]);
}

// generate three of a kind
const threeOfAKind = [];
for (var r = 12n; r >= 0n; r--) {
  for (var x = 0n; x < 4; x++) {
    const v = BIT_1111 ^ (1n << x);
    const mask = v << (r * 4n);
    threeOfAKind.push([mask]);
  }
}

// generate pair
const pair = [];
for (var r = 12n; r >= 0n; r--) {
  for (var x1 = 0n; x1 < 4n; x1++) {
    for (var x2 = x1 + 1n; x2 < 4n; x2++) {
      const v = BIT_1111 ^ (1n << x1) ^ (1n << x2);
      const mask = v << (r * 4n);
      pair.push([mask]);
    }
  }
}

// generate two pairs
const twoPair = [];
for (var r1 = 12n; r1 >= 0n; r1--) {
  for (var r2 = r1 - 1n; r2 >= 0n; r2--) {
    const arr = [];
    for (var x1 = 0n; x1 < 4; x1++) {
      for (var x2 = x1 + 1n; x2 < 4n; x2++) {
        for (var y1 = 0n; y1 < 4n; y1++) {
          for (var y2 = y1 + 1n; y2 < 4n; y2++) {
            const v1 = BIT_1111 ^ (1n << x1) ^ (1n << x2);
            const mask1 = v1 << (r1 * 4n);
            const v2 = BIT_1111 ^ (1n << y1) ^ (1n << y2);
            const mask2 = v2 << (r2 * 4n);
            const mask = mask1 | mask2;
            arr.push(mask);
          }
        }
      }
    }
    twoPair.push(arr);
  }
}
// generate full house
const fullHouse = [];
for (var r1 = 12n; r1 >= 0n; r1--) {
  for (var r2 = 12n; r2 >= 0n; r2--) {
    if (r1 == r2) continue;
    const arr = [];
    for (var x1 = 0n; x1 < 4n; x1++) {
      for (var x2 = x1 + 1n; x2 < 4n; x2++) {
        for (var y = 0n; y < 4n; y++) {
          const v3 = BIT_1111 ^ (1n << y);
          const mask3 = v3 << (r1 * 4n);
          const v2 = BIT_1111 ^ (1n << x1) ^ (1n << x2);
          const mask2 = v2 << (r2 * 4n);
          const mask = mask3 | mask2;
          arr.push(mask);
        }
      }
    }
    fullHouse.push(arr);
  }
}

// all special hands generated this way are guaranteed ordered by strength

export {
  straightFlush,
  fourOfAKind,
  fullHouse,
  flush,
  straight,
  threeOfAKind,
  twoPair,
  pair,
};

// uncomment this to write result to files
// import * as fs from "fs";
// fs.writeFileSync("./special-hands.json", JSON.stringify({
//   straightFlush: straightFlush.map(e => Number(e)),
//   fourOfAKind: fourOfAKind.map(e => Number(e)),
//   fullHouse: fullHouse.map(e => Number(e)),
//   flush: flush.map(e => Number(e)),
//   straight: straight.map(e => Number(e)),
//   threeOfAKind: threeOfAKind.map(e => Number(e)),
//   twoPair: twoPair.map(e => Number(e)),
//   pair: pair.map(e => Number(e)),
// }));
