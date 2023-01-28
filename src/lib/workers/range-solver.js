import { solve } from "$lib/poker/solver.js";
import { enumerate } from "$lib/poker/solver";

function updateProgress(w, l, t) {
  self.postMessage({
    name: "progress",
    win: w,
    lose: l,
    tie: t,
    covered: w + l + t,
  });
}

function start(data) {
  const used = data.handA.concat(data.community);
  let candidateA = [data.handA];
  let candidateB = data.candidateB;
  let candidateC = enumerate(used, data.community, 5);
  // this total number is not accurate since it includes invalid states
  // but for the sake of simplicity we can use it as an estimate
  let total = candidateA.length * candidateB.length * candidateC.length;
  let play = Math.min(total, data.play);
  self.postMessage({
    name: "estimate",
    play: play,
    total: total,
  });

  let result = solve(candidateA, candidateB, candidateC, play, updateProgress);
  self.postMessage({
    name: "ok",
    ...result,
  });
}

self.addEventListener("message", (e) => {
  if (e.data.name === "start") {
    start(e.data);
  }
});
