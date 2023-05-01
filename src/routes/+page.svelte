<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Hand from "$lib/components/hand-visualizer.svelte";
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
    interupted: false,
  };
  let gameBoard;
  let result = Object.assign({}, UNKOWN_RESULT);
  let isWorking = false;
  let worker;
  let gameToPlay = 1;

  function compute(e) {
    if (e) {
      e.preventDefault();
    }
    if (isWorking) {
      worker.terminate();
      isWorking = false;
      result.interupted = true;
      return;
    }
    result = Object.assign({}, UNKOWN_RESULT);
    if (!gameBoard.isValid()) {
      return;
    }
    if (worker) {
      worker.terminate();
    }
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
<header class="container prose prose-slate text-center dark:prose-invert">
  <h1>Poker Simulator <WavingHand>🃏</WavingHand></h1>
  <p>Enter your game state and let computer do the hard work for you</p>
</header>
<main class="container prose prose-slate text-center dark:prose-invert">
  <form>
    <GameBoard
      disabled={isWorking}
      bind:this={gameBoard}
      on:updated={() => (result = Object.assign({}, UNKOWN_RESULT))}
    />
    <div>
      <button type="submit" on:click={compute}
        >{isWorking ? "Stop" : "Compute"}</button
      >
    </div>
  </form>
  <div>
    {#if isWorking}
      <Bar
        value={result.covered}
        max={gameToPlay}
        indeterminate={!LIVE_UPDATE}
      />
      {#if LIVE_UPDATE}
        <small class="flex flex-col items-center justify-center gap-5">
          <div class="mt-5">
            <span>Looking into the future</span>
            <span class="font-mono">#{result.covered}</span>
          </div>
          <div class="my-auto flex items-baseline">
            <span>You are winning &nbsp</span>
            <div
              class="flex w-10 flex-col items-center justify-center font-mono font-bold"
            >
              <div class="">
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
      <h3>
        Press <strong>Compute</strong> to run the simulation for this board
      </h3>
    {/if}
  </div>
</main>
<footer class="my-10 text-center opacity-50">
  Made with ♥ by <strong><a href="https://hucanco.de/">hucancode</a></strong><br
  />
</footer>

<style>
  header,
  main,
  footer {
    @apply px-4;
  }
  h1 {
    @apply mt-0;
  }
  p,
  small {
    @apply leading-snug;
  }
  button {
    @apply m-2 bg-black px-4 py-1 text-xl font-bold uppercase text-white;
  }
  form {
    @apply flex flex-col items-center;
  }
  form > div:has(input) {
    @apply relative mt-6 mb-2 w-full;
  }
</style>
