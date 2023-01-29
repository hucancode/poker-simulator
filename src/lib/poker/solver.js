import { compare7, A_WIN, B_WIN, TIE } from "./compare.js";

// Monte Carlo method https://en.wikipedia.org/wiki/Monte_Carlo_algorithm

export function enumerateRange(config) {
  console.log("enumerate a range", config);
  let ret = [];
  const { r1, r2, suited, offSuited, extended } = config;
  const paired = r1 == r2;
  if (!config) {
    return ret;
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
        if (s1 == s2 && !suited) {
          continue;
        }
        if (s1 != s2 && !offSuited) {
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
      if (handA.some((e) => handB.includes(e))) continue;
      for (const community of candidateC) {
        if (handA.some((e) => community.includes(e))) continue;
        if (handB.some((e) => community.includes(e))) continue;
        total++;
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
