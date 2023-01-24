<script>
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
  const UNKOWN_RESULT = {
    win: 0,
    lose: 0,
    tie: 0,
    winRate: 0,
    total: 0,
    coveragePercent: 100,
    time: 0,
  };
  const HAND_DELIMETER = "-";
  let speedFast, speedSlow, speedVerySlow;
  let gameCodeInput;
  let result = UNKOWN_RESULT;
  let isWorking = false;
  let worker;
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
  }
  function compute(k = 1) {
    if (!gameCodeInput.validity.valid) {
      result = UNKOWN_RESULT;
      return;
    }
    result = UNKOWN_RESULT;
    const needed = 7 - (handB.length + community.length);
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
        break;
      case 4:
        jump = 12 * k;
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
      if (e.data.name === "ok") {
        result = e.data;
        isWorking = false;
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
  }

  onMount(() => {
    randomize();
    compute();
  });
</script>

<svelte:head>
  <title>Poker Simulator</title>
</svelte:head>
<header class="container prose prose-slate text-center dark:prose-invert">
  <h1>Poker Simulator <WavingHand>🃏</WavingHand></h1>
  <small
    >Enter your game state and let computer do the hard work for you <big
      >😌</big
    ></small
  >
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
    </div>
    <div class="mb-4 flex items-center justify-between gap-2">
      <Hand
        cards={handA}
        fill={2}
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
        fill={2}
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
    <Hand
      cards={community}
      fill={5}
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
    <div class="w-full">
      <input
        type="radio"
        name="speed"
        id="speed-fast"
        checked
        bind:this={speedFast}
      />
      <label for="speed-fast">Fast 🐰</label>
      <input type="radio" name="speed" id="speed-slow" bind:this={speedSlow} />
      <label for="speed-slow">Slow 🐢</label>
      <input
        type="radio"
        name="speed"
        id="speed-very-slow"
        bind:this={speedVerySlow}
      />
      <label for="speed-very-slow">🐌</label>
    </div>
    <div>
      <button on:click={doCompute}>{isWorking ? "Stop" : "Compute"}</button>
    </div>
  </form>
  <div>
    {#if isWorking}
      <Loading />
    {:else if result.total > 0}
      <Result {result} />
    {:else}
      <h3>Press <kbd>Compute</kbd> to see run the simulation for this board</h3>
    {/if}
  </div>
</main>
<footer class="my-10 opacity-50">
  Made with ♥ by <strong><a href="https://hucanco.de/">hucancode</a></strong><br
  />
  <small>
    Card evaluation algorithm based on bit masking and pre-calculation. <br />
    You can test the accuracy of the algorithm using
    <strong><a href="/specials">this tool</a></strong>
  </small>
</footer>

<style>
  header,
  main,
  footer {
    @apply px-4;
  }
  h1 {
    @apply mb-2 text-3xl;
  }
  h1 + p {
    @apply mt-0;
  }
  .button,
  button {
    @apply cursor-pointer bg-black px-4 py-1 text-xl font-bold uppercase text-white;
  }
  .button {
    @apply select-none px-6;
  }
  input {
    @apply border p-1 text-gray-800 valid:border-green-500 invalid:border-2 invalid:border-red-500;
  }
  input[type="text"] + label {
    @apply absolute -top-1/3 left-1 bg-black px-2 text-sm text-white;
  }
  input[type="radio"] {
    display: none;
  }
  input[type="radio"] + label {
    @apply w-1/3 bg-gray-600 px-4 py-2 text-center font-semibold text-gray-100;
  }
  input[type="radio"]:checked + label {
    @apply bg-black text-white;
  }
  form {
    @apply flex flex-col items-center;
  }
  form > div:has(input) {
    @apply relative mt-6 mb-2 flex items-center justify-center gap-2;
  }
  form > div:has(input[type="text"]) {
    @apply w-min;
  }
  input.small {
    @apply w-24;
  }
  input {
    @apply w-64;
  }
</style>
