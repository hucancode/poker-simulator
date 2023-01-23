import { handTextToArray } from "./cards.js";
import { solve } from "./solver.js";
import { evaluate } from "./compare.js";
if (false) {
  const hand = "KsAs";
  const community = "2d9h2h";
  const ret = solve(handTextToArray(hand), [], handTextToArray(community));
  console.log(ret);
}
let handRanks = [];

export function precomputeHandRank() {
  console.log("precompute start", new Date());
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
    if (usedCard == 2) {
      console.log("done evaluating", handRanks.length, "so far");
    }
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
  console.log("precompute done", new Date(), " result ", handRanks);
}

precomputeHandRank();
