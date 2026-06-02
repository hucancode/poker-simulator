<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import GameBoard from "$lib/components/board-overview.svelte";
  import ResultMulti from "$lib/components/result-multi.svelte";
  import WavingHand from "$lib/components/waving-hand.svelte";
  import Bar from "$lib/components/progress-bar.svelte";
  import PokerSolver from "$lib/workers/poker-solver?worker";

  const UNKNOWN_RESULT = {
    iterations: 0,
    heroWin: 0,
    heroTie: 0,
    heroLose: 0,
    villainEquity: [],
    time: 0,
    ready: false,
  };

  let gameBoard;
  let result = { ...UNKNOWN_RESULT };
  let isWorking = false;
  let worker = null;
  let errorMessage = "";

  function buildWorker() {
    worker = new PokerSolver();
    worker.addEventListener("message", (e) => {
      if (e.data.name === "ok" && e.data.mode === "multi") {
        result = {
          iterations: e.data.iterations,
          heroWin: e.data.heroWin,
          heroTie: e.data.heroTie,
          heroLose: e.data.heroLose,
          villainEquity: e.data.villainEquity,
          time: e.data.time,
          ready: true,
        };
        isWorking = false;
      } else if (e.data.name === "error") {
        errorMessage = e.data.message;
        isWorking = false;
      }
    });
    worker.postMessage({ name: "fixURI", baseURI: document.baseURI });
  }

  function compute() {
    if (isWorking) {
      if (worker) worker.terminate();
      worker = null;
      isWorking = false;
      return;
    }
    errorMessage = "";
    result = { ...UNKNOWN_RESULT };
    if (!gameBoard.isValid()) {
      errorMessage = "Pick 2 hero cards, 3-5 board cards, and a range for at least one villain.";
      return;
    }
    if (!worker) buildWorker();
    syncUrl();
    worker.postMessage({
      name: "startMulti",
      hero: gameBoard.getHero(),
      villains: gameBoard.getVillainNotations(),
      community: gameBoard.getCommunity(),
      maxIterations: 0,
      seed: 0,
    });
    isWorking = true;
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("h", gameBoard.getHero());
    params.set("c", gameBoard.getCommunity());
    for (const v of gameBoard.getVillainNotations()) params.append("v", v);
    goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
  }

  onMount(async () => {
    const params = $page.url.searchParams;
    if (params.has("h") || params.has("v") || params.has("c")) {
      gameBoard.loadFromUrl(params);
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

<main class="container main-narrow">
  <form on:submit|preventDefault={compute}>
    <GameBoard
      disabled={isWorking}
      bind:this={gameBoard}
      on:updated={() => {
        result = { ...UNKNOWN_RESULT };
        errorMessage = "";
      }}
    />
    <div class="action">
      <button type="submit">{isWorking ? "Stop" : "Compute"}</button>
    </div>
  </form>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <div class="result-area">
    {#if isWorking}
      <Bar />
      <small class="muted">Crunching outcomes…</small>
    {:else if result.ready}
      <ResultMulti {result} />
    {:else}
      <small class="muted"
        >Enter your game state and let computer do the hard work for you</small
      >
    {/if}
  </div>
</main>

<footer class="footer">
  Made with ♥ by <strong><a href="https://hucanco.de/">hucancode</a></strong>
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
    margin: 0 auto;
  }
  h1 {
    margin-top: 0;
    margin-bottom: 1rem;
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  .action {
    display: flex;
    justify-content: center;
    margin-top: 0.75rem;
  }
  button[type="submit"] {
    background: #000;
    color: #fff;
    padding: 0.5rem 1.5rem;
    font-size: 1.125rem;
    font-weight: 700;
    text-transform: uppercase;
    border: 0;
    cursor: pointer;
  }
  .result-area {
    margin-top: 1rem;
    text-align: center;
  }
  .error {
    color: #b91c1c;
    text-align: center;
    font-size: 0.875rem;
    margin: 0.5rem 0;
  }
  .muted {
    color: #6b7280;
  }
  .footer {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    opacity: 0.5;
  }
</style>
