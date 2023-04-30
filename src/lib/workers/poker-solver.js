import init, { solve } from "poker-solver";

async function start(data) {
  let start = new Date();
  await init();
  const result = solve(data.handA, data.handB, data.community);
  let now = new Date();
  let time = now.getTime() - start.getTime();
  self.postMessage({
    name: "ok",
    time,
    win: result.win,
    lose: result.lose,
    tie: result.tie,
  });
}
self.addEventListener("message", (e) => {
  if (e.data.name === "start") {
    start(e.data);
  }
});
