import { solve, calculatePossibleOutcome } from "$lib/poker/solver.js";
import { enumerate } from "../poker/solver";

self.addEventListener("message", (e) => {
  if (e.data.name === "start") {
    let config = enumerate(
      e.data.handA,
      e.data.handB,
      e.data.community,
      e.data.step
    );
    self.postMessage({
      name: "estimate",
      play: config.candidateB.length * config.candidateC.length,
      total: calculatePossibleOutcome(
        e.data.handA,
        e.data.handB,
        e.data.community
      ),
    });
    const onProgress = (w, l, t) => {
      self.postMessage({
        name: "progress",
        win: w,
        lose: l,
        tie: t,
        covered: w + l + t,
      });
    };
    let result = solve(
      e.data.handA,
      e.data.handB,
      e.data.community,
      config.candidateB,
      config.candidateC,

      onProgress
    );
    self.postMessage({
      name: "ok",
      ...result,
    });
  }
});
