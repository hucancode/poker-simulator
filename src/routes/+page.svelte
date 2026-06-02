<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import GameBoard from "$lib/components/game-board.svelte";
  import Result from "$lib/components/result-visualizer.svelte";
  import WavingHand from "$lib/components/waving-hand.svelte";
  import Bar from "$lib/components/progress-bar.svelte";
  import PokerSolver from "$lib/workers/poker-solver?worker";

  const LIVE_UPDATE = false;

  const UNKOWN_RESULT = {
    win: 0,
    lose: 0,
    tie: 0,
    total: -1,
    covered: 0,
    time: 0,
    winRate: 0,
  };
  let gameBoard;
  let result = { ...UNKOWN_RESULT };
  let isWorking = false;
  let worker = null;
  let gameCode = "";

  function buildWorker() {
    worker = new PokerSolver();
    worker.addEventListener("message", (e) => {
      if (e.data.name === "ok") {
        reportComputeData(e.data);
      }
    });
    worker.postMessage({
      name: "fixURI",
      baseURI: document.baseURI,
    });
  }
  function compute() {
    if (isWorking) {
      if (worker) {
        worker.terminate();
      }
      worker = null;
      return;
    }
    result = { ...UNKOWN_RESULT };
    if (!gameBoard.isValid()) {
      return;
    }
    if (!worker) {
      buildWorker();
    }
    $page.url.searchParams.set("code", gameCode);
    goto(`?${$page.url.searchParams.toString()}`);
    worker.postMessage({
      name: "start",
      handA: gameBoard.getHandA(),
      handB: gameBoard.getHandB(),
      community: gameBoard.getCommunity(),
    });
    isWorking = true;
  }

  function reportComputeData(data) {
    result.win = data.win;
    result.lose = data.lose;
    result.tie = data.tie;
    result.covered = result.total = result.win + result.lose + result.tie;
    result.winRate = (result.win / result.covered) * 100;
    result.time = data.time;
    isWorking = false;
  }

  onMount(async () => {
    const code = $page.url.searchParams.get("code");
    if (code) {
      gameCode = code;
      gameBoard.updateWithText(code);
      compute();
    } else {
      gameBoard.randomize();
    }
  });
</script>

<svelte:head>
  <title>Poker Simulator</title>
</svelte:head>
<header class="container text-center">
  <h1>Poker Simulator <WavingHand>🃏</WavingHand></h1>
</header>
<main class="container text-center main-narrow">
  <form>
    <GameBoard
      disabled={isWorking}
      bind:this={gameBoard}
      bind:code={gameCode}
      on:updated={() => (result = { ...UNKOWN_RESULT })}
    />
    <div class="action">
      <button type="submit" on:click|preventDefault={compute}
        >{isWorking ? "Stop" : "Compute"}</button
      >
    </div>
  </form>
  <div>
    {#if isWorking}
      <Bar
        value={LIVE_UPDATE ? result.covered : null}
        max={LIVE_UPDATE ? result.total : null}
      />
      {#if LIVE_UPDATE}
        <small class="live">
          <div class="row-mt">
            <span>Looking into the future</span>
            <span class="mono">#{result.covered}</span>
          </div>
          <div class="winning">
            <span>You are winning &nbsp</span>
            <div class="win-count">
              <div>
                {result.win}
              </div>
              ({result.winRate.toFixed(1)}%)
            </div>
            <span>&nbsp;games so far</span>
          </div>
        </small>
      {/if}
    {:else if result.total >= 0}
      <Result {result} />
    {:else}
      <small class="muted"
        >Enter your game state and let computer do the hard work for you</small
      >
    {/if}
  </div>
</main>
<footer class="footer">
  Made with ♥ by <strong><a href="https://hucanco.de/">hucancode</a></strong><br
  />
</footer>

<style>
  header,
  main,
  footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .main-narrow {
    max-width: 32rem;
  }
  h1 {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
  small {
    font-size: 0.75rem;
    font-weight: 100;
    line-height: 1.375;
  }
  .muted {
    color: #6b7280;
  }
  .action {
    margin-top: 0.5rem;
  }
  .footer {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    opacity: 0.5;
  }
  button {
    margin: 0.5rem;
    background: #000;
    padding: 0.25rem 1rem;
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #fff;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .live {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
  }
  .row-mt {
    margin-top: 1.25rem;
  }
  .mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
  .winning {
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    align-items: baseline;
  }
  .win-count {
    display: flex;
    width: 2.5rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 700;
  }
</style>
