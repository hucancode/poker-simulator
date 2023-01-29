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
  // this total number is not accurate since it includes invalid states
  // but for the sake of simplicity we can use it as an estimate
  let total =
    data.candidateA.length * data.candidateB.length * data.candidateC.length;
  let play = Math.min(total, data.play);
  self.postMessage({
    name: "estimate",
    play: play,
    total: total,
  });

  let result = solve(
    data.candidateA,
    data.candidateB,
    data.candidateC,
    play,
    updateProgress
  );
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
