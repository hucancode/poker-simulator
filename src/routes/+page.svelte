<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { handTextToArray, handArrayToText } from "$lib/poker/cards";
  import Hand from "$lib/components/hand-visualizer.svelte";
  import GameBoard from "$lib/components/game-board.svelte";
  import Result from "$lib/components/result-visualizer.svelte";
  import WavingHand from "$lib/components/waving-hand.svelte";
  import Bar from "$lib/components/progress-bar.svelte";

  const TEST_FAST = 1000;
  const TEST_NORMAL = 10000;
  const TEST_SLOW = 50000;
  const TEST_EXTRA_SLOW = 200000;
  const HAND_DELIMETER = ",";
  const COMMUNITY_TEXT_REGEX = "([2-9TJQKA][scdh]){3,5}";
  const MY_HAND_TEXT_REGEX = "([2-9TJQKA][scdh]){2}";
  const THEIR_HAND_FIXED_REGEX = "([2-9TJQKA][scdh]){0,2}";
  const THEIR_HAND_RANGE_REGEX = "([2-9TJQKA]{2}[so]?\\+?)";
  const THEIR_HAND_TEXT_REGEX = `((${THEIR_HAND_FIXED_REGEX})|(${THEIR_HAND_RANGE_REGEX}))`;

  const GAME_CODE_REGEX = `${MY_HAND_TEXT_REGEX}${HAND_DELIMETER}${THEIR_HAND_TEXT_REGEX}${HAND_DELIMETER}${COMMUNITY_TEXT_REGEX}`;
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
  let speedFast, speedSlow, speedVerySlow, speedAllDay;
  let gameBoard;
  let result = Object.assign({}, UNKOWN_RESULT);
  let isWorking = false;
  let worker;
  let gameToPlay = 1;

  function doCompute(e) {
    e.preventDefault(); //prevents jumpscrolling to the top on button press.
    if (isWorking) {
      worker.terminate();
      isWorking = false;
      result.interupted = true;
      return;
    }
    if (speedFast.checked) {
      return compute(TEST_FAST);
    }
    if (speedSlow.checked) {
      return compute(TEST_NORMAL);
    }
    if (speedVerySlow.checked) {
      return compute(TEST_SLOW);
    }
    if (speedAllDay.checked) {
      return compute(TEST_EXTRA_SLOW);
    }
  }

  function compute(k = 1000) {
    if (!gameBoard.isValid()) {
      result = Object.assign({}, UNKOWN_RESULT);
      return;
    }
    result = Object.assign({}, UNKOWN_RESULT);
    if (worker) {
      worker.terminate();
    }
    worker = new Worker(
      new URL("$lib/workers/poker-solver.js", import.meta.url),
      {
        type: "module",
      }
    );
    worker.addEventListener("message", (e) => {
      if (e.data.name == "progress") {
        result.covered = e.data.covered;
        result.win = e.data.win;
        result.lose = e.data.lose;
        result.tie = e.data.tie;
        result.winRate = (result.win / result.covered) * 100;
      } else if (e.data.name === "ok") {
        result = e.data;
        isWorking = false;
      } else if (e.data.name == "estimate") {
        result.total = e.data.total;
        gameToPlay = e.data.play;
      }
    });
    worker.postMessage({
      name: "start",
      candidateA: gameBoard.getCandidateA(),
      candidateB: gameBoard.getCandidateB(),
      candidateC: gameBoard.getCandidateC(),
      play: k,
    });
    isWorking = true;
    result.interupted = false;
    result.covered = 0;
    result.total = 0;
  }

  onMount(() => {
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
    <div class="flex w-full flex-col justify-center">
      <strong>Number of tests</strong>
      <div class="flex w-full flex-wrap justify-center gap-0.5">
        <input
          type="radio"
          name="speed"
          id="speed-fast"
          checked
          bind:this={speedFast}
        />
        <label title={TEST_FAST} for="speed-fast">🚀<br />{TEST_FAST}</label>
        <input
          type="radio"
          name="speed"
          id="speed-slow"
          bind:this={speedSlow}
        />
        <label title={TEST_NORMAL} for="speed-slow">🐰<br />{TEST_NORMAL}</label
        >
        <input
          type="radio"
          name="speed"
          id="speed-very-slow"
          bind:this={speedVerySlow}
        />
        <label title={TEST_SLOW} for="speed-very-slow"
          >🐢<br />{TEST_SLOW}</label
        >
        <input
          type="radio"
          name="speed"
          id="speed-all-day"
          bind:this={speedAllDay}
        />
        <label title={TEST_EXTRA_SLOW} for="speed-all-day"
          >🐌<br />{TEST_EXTRA_SLOW}</label
        >
      </div>
    </div>
    <div>
      <button type="submit" on:click={doCompute}>{isWorking ? "Stop" : "Compute"}</button>
    </div>
  </form>
  <div>
    {#if isWorking}
      <Bar percentage={(result.covered / gameToPlay) * 100} />
      <!-- essentially only changed numbers to font-mono and restructured html. 
             added margin top to the first line and font-bold to result.
            now the numbers won't jitter as they are changing, being easier on the eyes, generally more clean look.
            -->
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
  input[type="radio"] {
    display: none;
  }
  input[type="radio"] + label {
    @apply w-1/5 bg-gray-600 px-1 py-2 text-center font-semibold text-gray-100;
  }
  input[type="radio"]:checked + label {
    @apply bg-black text-white;
  }
  form {
    @apply flex flex-col items-center;
  }
  form > div:has(input) {
    @apply relative mt-6 mb-2 w-full;
  }
</style>
