<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import {
    handTextToArray,
    handArrayToText,
    cardIdToText,
  } from "$lib/poker/cards";
  import Hand from "$lib/components/hand-visualizer.svelte";
  import Picker from "$lib/components/card-picker.svelte";
  import Result from "$lib/components/result-visualizer.svelte";
  import WavingHand from "$lib/components/waving-hand.svelte";
  import Loading from "$lib/components/loading.svelte";
  import Bar from "$lib/components/progress-bar.svelte";

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
  const HAND_DELIMETER = "-";
  let speedFast, speedSlow, speedVerySlow, speedAllDay;
  let gameCodeInput;
  let result = UNKOWN_RESULT;
  let isWorking = false;
  let slowWarning = false;
  let worker;
  let gameToPlay = 1;
  let community = [],
    handA = [],
    handB = [];
  function updateArrayFromText() {
    if (!gameCodeInput.validity.valid) {
      community = [];
      handA = [];
      handB = [];
      return;
    }
    const arr = gameCodeInput.value.split(HAND_DELIMETER);
    $page.url.searchParams.set("code", gameCodeInput.value);
    handA = handTextToArray(arr[0]);
    handB = handTextToArray(arr[1]);
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
    handB = pool.slice(2, 4);
    community = pool.slice(5, 10);
    updateTextFromArray();
    result = UNKOWN_RESULT;
  }

  function doCompute() {
    if (isWorking) {
      worker.terminate();
      isWorking = false;
      result.interupted = true;
      return;
    }
    if (speedFast.checked) {
      return compute();
    }
    if (speedSlow.checked) {
      return compute(0.6);
    }
    if (speedVerySlow.checked) {
      return compute(0.3);
    }
    if (speedAllDay.checked) {
      return compute(0.1);
    }
  }
  function compute(k = 1) {
    if (!gameCodeInput.validity.valid) {
      result = UNKOWN_RESULT;
      return;
    }
    result = UNKOWN_RESULT;
    const needed = 7 - (handB.length + community.length);
    slowWarning = false;
    let jump;
    switch (needed) {
      case 1:
        jump = 1;
        break;
      case 2:
        jump = 2 * k;
        break;
      case 3:
        jump = 6 * k;
        slowWarning = jump <= 2;
        break;
      case 4:
        jump = 12 * k;
        slowWarning = jump <= 4;
        break;
      default:
        jump = 1;
    }
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
      handA: handA,
      handB: handB,
      community: community,
      step: jump,
    });
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
        pattern={"([2-9tjqkaTJQKA][scdh]){2}-([2-9tjqkaTJQKA][scdh]){0,2}-([2-9tjqkaTJQKA][scdh]){3,5}"}
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
          updateTextFromArray();
        }}
        on:add={(e) => {
          handB = handB;
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
        <label for="speed-fast">🚀</label>
        <input
          type="radio"
          name="speed"
          id="speed-slow"
          bind:this={speedSlow}
        />
        <label for="speed-slow">🐰</label>
        <input
          type="radio"
          name="speed"
          id="speed-very-slow"
          bind:this={speedVerySlow}
        />
        <label for="speed-very-slow">🐢</label>
        <input
          type="radio"
          name="speed"
          id="speed-all-day"
          bind:this={speedAllDay}
        />
        <label for="speed-all-day">I can do this all day 🐌</label>
      </div>
    </div>
    <div>
      <button on:click={doCompute}>{isWorking ? "Stop" : "Compute"}</button>
    </div>
  </form>
  <div>
    {#if isWorking}
      <Bar percentage={(result.covered / gameToPlay) * 100} />
      <small
        >Looking into the future... <br />You are winning {result.win}/{result.covered}
        ({result.winRate.toFixed(1)}%) games so far</small
      >
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
