import { solve } from "$lib/poker/solver.js";

self.addEventListener("message", (e) => {
  if (e.data.name === "start") {
    let result = solve(
      e.data.handA,
      e.data.handB,
      e.data.community,
      e.data.step
    );
    self.postMessage({
      name: "ok",
      ...result,
    });
  }
});
