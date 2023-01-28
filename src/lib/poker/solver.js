import { compare7, A_WIN, B_WIN, TIE } from "./compare.js";

// Monte Carlo method https://en.wikipedia.org/wiki/Monte_Carlo_algorithm

export function enumerate(used, hand, size) {
  let ret = [];
  console.log("building candidates array");
  let st = [];
  let extra = [];
  if (hand.length >= size) {
    return [hand];
  }
  for (var c = 0; c < 52; c++) {
    st.push(c);
  }
  while (st.length > 0) {
    const c = st[st.length - 1];
    st.pop();
    if (c == -1) {
      extra.pop();
      continue;
    }
    if (used.includes(c)) continue;
    extra.push(c);
    if (extra.length + hand.length == size) {
      ret.push(hand.concat(extra));
      extra.pop();
      continue;
    }
    st.push(-1);
    for (var next = c + 1; next < 52; next++) {
      st.push(next);
    }
  }
  ret.sort((a, b) => 0.5 - Math.random());
  return ret;
}

export function solve(
  candidateA,
  candidateB,
  candidateC,
  testToRun = 10000,
  onProgress = null
) {
  const startSolvingTime = new Date();
  console.log("running tests...");
  // console.log("candidates", candidateA, candidateB, candidateC);
  // run the tests with candidates
  let win = 0;
  let lose = 0;
  let tie = 0;
  let total = 0;

  for (const handA of candidateA) {
    for (const handB of candidateB) {
      for (const community of candidateC) {
        if (handB.some((e) => community.includes(e))) continue;
        total++;
        // assume that handA will never overlap with community & handB
        if (testToRun < 0) {
          continue;
        }
        testToRun--;
        const ret = compare7(handA.concat(community), handB.concat(community));
        if (ret == A_WIN) win++;
        if (ret == B_WIN) lose++;
        if (ret == TIE) tie++;
        if (onProgress) {
          onProgress(win, lose, tie);
        }
      }
    }
  }
  const covered = lose + win + tie;
  // this number isn't accurate since it includes invalid state
  const winRate = (win / covered) * 100;
  const coveragePercent = (covered / total) * 100;
  console.log("done running tests");
  const now = new Date();
  const time = now - startSolvingTime;
  return {
    win,
    lose,
    tie,
    winRate,
    covered,
    total,
    coveragePercent,
    time,
  };
}
