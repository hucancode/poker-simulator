import init, { solve, solve_multi } from "poker-solver";

async function startSingle(data) {
  const t0 = Date.now();
  await init();
  const result = solve(data.handA, data.handB, data.community);
  const time = Date.now() - t0;
  self.postMessage({
    name: "ok",
    mode: "single",
    time,
    win: result.win,
    lose: result.lose,
    tie: result.tie,
  });
}

async function startMulti(data) {
  const t0 = Date.now();
  await init();
  const json = solve_multi(
    data.hero,
    data.villains,
    data.community,
    data.maxIterations | 0,
    data.seed | 0,
  );
  const time = Date.now() - t0;
  try {
    const parsed = JSON.parse(json);
    if (parsed.error) {
      self.postMessage({ name: "error", message: parsed.error });
      return;
    }
    self.postMessage({
      name: "ok",
      mode: "multi",
      time,
      iterations: parsed.iterations,
      heroWin: parsed.hero_win,
      heroTie: parsed.hero_tie,
      heroLose: parsed.hero_lose,
      villainEquity: parsed.villain_equity,
    });
  } catch (e) {
    self.postMessage({ name: "error", message: String(e) });
  }
}

self.addEventListener("message", (e) => {
  if (e.data.name === "fixURI") {
    self.document = { baseURI: e.data.baseURI };
    return;
  }
  if (e.data.name === "start") {
    startSingle(e.data);
    return;
  }
  if (e.data.name === "startMulti") {
    startMulti(e.data);
  }
});
