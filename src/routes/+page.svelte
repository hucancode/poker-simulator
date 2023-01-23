<script>
  import { onMount } from "svelte";
  import { handTextToArray, cardIdToText } from "$lib/poker/cards";
  import Hand from "$lib/components/hand-visualizer.svelte";
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
  };

  let speedFast, speedSlow, speedVerySlow;
  let community,
    handA,
    handB,
    result = UNKOWN_RESULT;
  let isWorking = false;
  let worker;
  let communityInt, handAInt, handBInt;
  function invalidate() {
    communityInt = handTextToArray(
      community.validity.valid ? community.value : null
    );
    handAInt = handTextToArray(handA.validity.valid ? handA.value : null);
    handBInt = handTextToArray(handB.validity.valid ? handB.value : null);
    result = UNKOWN_RESULT;
  }
  function randomCard(n) {
    let taken = handTextToArray(community.value + handA.value + handB.value);
    let pool = Array(52)
      .fill()
      .map((e, i) => i)
      .filter((i) => !taken.includes(i));
    return pool
      .sort((a, b) => Math.random() - 0.5)
      .slice(0, n)
      .map((i) => cardIdToText(i))
      .reduce((ret, v) => ret + v);
  }
  function clearC() {
    const n = community.value.length;
    community.value = community.value.slice(
      0,
      Math.max(3, Math.floor(n / 2) - 1) * 2
    );
    invalidate();
  }
  function randomC() {
    community.value = "";
    community.value = randomCard(5);
    invalidate();
  }
  function clearA() {
    const n = handA.value.length;
    handA.value = handA.value.slice(0, Math.max(0, Math.floor(n / 2) - 1) * 2);
    invalidate();
  }
  function randomA() {
    handA.value = "";
    handA.value = randomCard(2);
    invalidate();
  }
  function clearB() {
    const n = handB.value.length;
    handB.value = handB.value.slice(0, Math.max(0, Math.floor(n / 2) - 1) * 2);
    invalidate();
  }
  function randomB() {
    handB.value = "";
    handB.value = randomCard(2);
    invalidate();
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
    if (
      !(
        community.validity.valid &&
        handA.validity.valid &&
        handB.validity.valid
      )
    ) {
      result = UNKOWN_RESULT;
      return;
    }
    const a = handTextToArray(handA.value);
    const b = handTextToArray(handB.value);
    const c = handTextToArray(community.value);
    result = UNKOWN_RESULT;
    const needed = 7 - (b.length + c.length);
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
      handA: a,
      handB: b,
      community: c,
      step: jump,
    });
    isWorking = true;
  }

  onMount(() => {
    randomA();
    randomB();
    randomC();
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
        title="Enter 2 cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]"
        bind:this={handA}
        id="hand-a"
        type="text"
        on:change={invalidate}
        value="KsAs"
        pattern={"([2-9tjqkaTJQKA][scdh]){2}"}
        required
      />
      <label for="hand-a">Your Hand</label>
      <div class="button" title="Randomize cards" on:click={randomA}>🎲</div>
      <div class="button" title="Clear 1 card" on:click={clearA}>🃏</div>
    </div>
    <Hand cards={handAInt} fill={2} />
    <div>
      <input
        title="Enter 3-5 cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]"
        bind:this={community}
        id="community"
        type="text"
        value="2d9h2hJhKh"
        pattern={"([2-9tjqkaTJQKA][scdh]){3,5}"}
        on:change={invalidate}
        required
      />
      <label for="community">Community Cards</label>
      <div class="button" title="Randomize cards" on:click={randomC}>🎲</div>
      <div class="button" title="Clear 1 card" on:click={clearC}>🃏</div>
    </div>
    <Hand cards={communityInt} fill={5} />
    <div>
      <input
        title="Enter 2 or 0 cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]"
        bind:this={handB}
        id="hand-b"
        type="text"
        on:change={invalidate}
        value="2s2c"
        pattern={"([2-9tjqkaTJQKA][scdh]){0,2}"}
      />
      <label for="hand-b">Their Hand</label>
      <div class="button" title="Randomize cards" on:click={randomB}>🎲</div>
      <div class="button" title="Clear 1 card" on:click={clearB}>🃏</div>
    </div>
    <Hand cards={handBInt} fill={2} />
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
    @apply select-none px-6 text-2xl;
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
  form > div {
    @apply relative mt-6 mb-2 flex items-center justify-center gap-2;
  }
  form > div:has(input[type="text"]) {
    @apply w-min;
  }
  input {
    @apply w-48;
  }
</style>
