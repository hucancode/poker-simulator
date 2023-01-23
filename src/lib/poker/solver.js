import { compare7, A_WIN, B_WIN, TIE } from "./compare.js";

// Monte Carlo method https://en.wikipedia.org/wiki/Monte_Carlo_algorithm
const JUMP_3 = 12;
const JUMP_4 = 5;
const JUMP_5 = 1;

function productRange(a, b) {
  let ret = 1;
  while (a <= b) {
    ret *= a;
    a++;
  }
  return ret;
}

function ncr(n, r) {
  return productRange(r + 1, n) / productRange(1, n - r);
}

function randomJump(x) {
  return Math.ceil(Math.random() * x);
}

export function solve(handA, handB, community, step = JUMP_3) {
  console.log("solving", handA, community, handB);
  let used = [];
  let candidateB = [];
  let candidateC = [];
  for (const card of handA) used.push(card);
  for (const card of community) used.push(card);
  for (const card of handB) used.push(card);
  // build candidates array
  console.log("building candidates array");
  let st = [];
  let extra = [];
  if (community.length < 5) {
    for (var c = 0; c < 52; c += randomJump(step)) {
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
      if (extra.length + community.length == 5) {
        candidateC.push(extra.slice());
        extra.pop();
        continue;
      }
      st.push(-1);
      for (var next = c + 1; next < 52; next += randomJump(step)) {
        st.push(next);
      }
    }
  } else {
    candidateC = [[]];
  }
  extra = [];
  if (handB.length < 2) {
    for (var c = 0; c < 52; c += randomJump(step)) {
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
      if (extra.length + handB.length == 2) {
        candidateB.push(extra.slice());
        extra.pop();
        continue;
      }
      st.push(-1);
      for (var next = c + 1; next < 52; next += randomJump(step)) {
        st.push(next);
      }
    }
  } else {
    candidateB = [[]];
  }
  console.log(
    "done enumerating candidates, there are",
    candidateC.length,
    "ways to pick community cards, there are",
    candidateB.length,
    "ways to pick opponent cards"
  );
  console.log("running tests...");
  // run the tests with candidates
  let win = 0;
  let lose = 0;
  let tie = 0;
  for (const extraB of candidateB) {
    const handBFinal = handB.concat(extraB);
    // console.log("checking with opp hand", extraB);
    for (const extraC of candidateC) {
      if (extraB.some((e) => extraC.includes(e))) continue;
      // console.log("checking with community cards", extraC);
      const communityFinal = community.concat(extraC);
      const ret = compare7(
        handA.concat(communityFinal),
        handBFinal.concat(communityFinal)
      );
      if (ret == A_WIN) win++;
      if (ret == B_WIN) lose++;
      if (ret == TIE) tie++;
    }
  }
  const pickC = ncr(52 - community.length - 2, 5 - community.length);
  const pickB = ncr(45 - handB.length, 2 - handB.length);
  const total = pickB * pickC;
  const winRate = (win / (lose + win + tie)) * 100;
  const coveragePercent = ((win + lose + tie) / total) * 100;
  console.log("done running tests");
  return {
    win,
    lose,
    tie,
    winRate,
    total,
    coveragePercent,
  };
}
