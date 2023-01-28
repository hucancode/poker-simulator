<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import {
    handTextToArray,
    handArrayToText,
    rangeTextToArray,
  } from "$lib/poker/cards";
  import Hand from "$lib/components/hand-visualizer.svelte";
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
    total: 0,
    covered: 0,
    time: 0,
    winRate: 0,
    interupted: false,
  };
  let speedFast, speedSlow, speedVerySlow, speedAllDay;
  let gameCodeInput;
  let result = UNKOWN_RESULT;
  let isWorking = false;
  let worker;
  let gameToPlay = 1;
  let community = [],
    handA = [],
    handB = [];
  let candidateB = [];

  function updateArrayFromText() {
    if (!gameCodeInput.validity.valid) {
      community = [];
      handA = [];
      handB = [];
      return;
    }
    const arr = gameCodeInput.value.split(HAND_DELIMETER);
    // $page.url.searchParams.set("code", gameCodeInput.value);
    handA = handTextToArray(arr[0]);
    handB = handTextToArray(arr[1]);
    candidateB = rangeTextToArray(arr[1]);
    community = handTextToArray(arr[2]);
    result = UNKOWN_RESULT;
  }

  function updateTextFromArray() {
    gameCodeInput.value =
      handArrayToText(handA) +
      HAND_DELIMETER +
      handArrayToText(handB) +
      HAND_DELIMETER +
      handArrayToText(community);
    /* $page.url.searchParams.set('code', gameCodeInput.value); */
    /* document.location.search = $page.url.searchParams; */
    result = UNKOWN_RESULT;
  }

  function randomize() {
    let pool = Array(52)
      .fill()
      .map((e, i) => i)
      .sort((a, b) => Math.random() - 0.5);
    handA = pool.slice(0, 2);
    /* handB = pool.slice(2, 4); */
    community = pool.slice(5, 10);
    updateTextFromArray();
    result = UNKOWN_RESULT;
  }

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
    if (!gameCodeInput.validity.valid) {
      result = UNKOWN_RESULT;
      return;
    }
    result = UNKOWN_RESULT;
    if (worker) {
      worker.terminate();
    }
    if (candidateB.length > 0) {
      worker = new Worker(
        new URL("$lib/workers/range-solver.js", import.meta.url),
        {
          type: "module",
        }
      );
    } else {
      worker = new Worker(
        new URL("$lib/workers/poker-solver.js", import.meta.url),
        {
          type: "module",
        }
      );
    }
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
    if (candidateB.length > 0) {
      worker.postMessage({
        name: "start",
        handA: handA,
        candidateB: candidateB,
        community: community,
        play: k,
      });
    } else {
      worker.postMessage({
        name: "start",
        handA: handA,
        handB: handB,
        community: community,
        play: k,
      });
    }
    isWorking = true;
    result.interupted = false;
    result.covered = 0;
    result.total = 0;
  }

  onMount(() => {
    const code = $page.url.searchParams.get("code");
    if (code) {
      gameCodeInput.value = code;
      updateArrayFromText();
      compute();
    } else {
      randomize();
    }
  });
</script>

<svelte:head>
  <title>Poker Simulator</title>
</svelte:head>
<header class="container prose prose-slate text-center dark:prose-invert">
  <h1>Poker Simulator <WavingHand>🃏</WavingHand></h1>
  <p>
    Enter your game state and let computer do the hard work for you <big>😌</big
    >
  </p>
</header>
<main class="container prose prose-slate text-center dark:prose-invert">
  <form>
    <div>
      <input
        title="Enter 5-9 cards. 2 for you, 0-2 for them, 3-5 community cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]"
        bind:this={gameCodeInput}
        id="game-code"
        type="text"
        pattern={GAME_CODE_REGEX}
        on:change={updateArrayFromText}
        required
      />
      <label for="game-code">Game Code</label>
      <small class="help-general"
        >You can use standard notation <em>(2-9TJQKA + scdh)</em></small
      >
      <small class="help-invalid-input"
        >You need <em>2 hand cards</em> and <em>3+ community cards</em></small
      >
    </div>
    <div class="mt-6 flex w-full justify-between">
      <strong class="w-full text-center">Your Cards</strong>
      <strong class="w-full text-center">Their Cards</strong>
    </div>
    <div class="mb-4 flex items-center justify-between gap-2">
      <Hand
        cards={handA}
        max={2}
        min={2}
        usedCards={handB.concat(community)}
        on:remove={(e) => {
          handA = handA;
          updateTextFromArray();
        }}
        on:add={(e) => {
          handA = handA;
          updateTextFromArray();
        }}
      />
      <strong>VS</strong>
      <Hand
        cards={handB}
        max={2}
        min={0}
        usedCards={handA.concat(community)}
        on:remove={(e) => {
          handB = handB;
          candidateB = []; // card picker doesnt work with range yet
          updateTextFromArray();
        }}
        on:add={(e) => {
          handB = handB;
          candidateB = []; // card picker doesnt work with range yet
          updateTextFromArray();
        }}
      />
    </div>
    <strong class="w-full text-center">Community Cards</strong>
    <Hand
      cards={community}
      max={5}
      min={3}
      usedCards={handA.concat(handB)}
      on:remove={(e) => {
        community = community;
        updateTextFromArray();
      }}
      on:add={(e) => {
        community = community;
        updateTextFromArray();
      }}
    />
    <div class="flex flex-col justify-center">
      <strong>Number of tests (fewer is faster)</strong>
      <div class="flex flex-wrap justify-center gap-0.5">
        <input
          type="radio"
          name="speed"
          id="speed-fast"
          checked
          bind:this={speedFast}
        />
        <label title={TEST_FAST} for="speed-fast">🚀</label>
        <input
          type="radio"
          name="speed"
          id="speed-slow"
          bind:this={speedSlow}
        />
        <label title={TEST_NORMAL} for="speed-slow">🐰</label>
        <input
          type="radio"
          name="speed"
          id="speed-very-slow"
          bind:this={speedVerySlow}
        />
        <label title={TEST_SLOW} for="speed-very-slow">🐢</label>
        <input
          type="radio"
          name="speed"
          id="speed-all-day"
          bind:this={speedAllDay}
        />
        <label title={TEST_EXTRA_SLOW} for="speed-all-day"
          >I can do this all day 🐌</label
        >
      </div>
    </div>
    <div>
      <button on:click={doCompute}>{isWorking ? "Stop" : "Compute"}</button>
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
    {:else if result.total > 0}
      <Result {result} />
    {:else}
      <h3>Press <kbd>Compute</kbd> to run the simulation for this board</h3>
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
  input[type="text"]:valid ~ .help-general,
  input[type="text"]:invalid ~ .help-invalid-input {
    @apply block;
  }
  input[type="text"]:invalid ~ .help-general,
  input[type="text"]:valid ~ .help-invalid-input {
    @apply hidden;
  }
  .button,
  button {
    @apply m-2 cursor-pointer bg-black px-4 py-1 text-xl font-bold uppercase text-white;
  }
  .button {
    @apply select-none px-6;
  }
  input {
    @apply w-full border p-1 text-center text-gray-800 valid:border-green-500 invalid:border-red-500;
  }
  input[type="text"] + label {
    @apply absolute -top-1/3 left-1/2 -translate-x-1/2 bg-black px-2 text-sm text-white;
  }
  input[type="radio"] {
    display: none;
  }
  input[type="radio"] + label {
    @apply bg-gray-600 px-4 py-2 text-center font-semibold text-gray-100;
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
