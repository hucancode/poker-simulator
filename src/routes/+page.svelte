<script>
  import { onMount } from "svelte";
  import { handTextToArray, cardIdToText } from "$lib/poker/cards";
  import Hand from "$lib/components/hand-visualizer.svelte";
  import Result from "$lib/components/result-visualizer.svelte";
  import WavingHand from "$lib/components/waving-hand.svelte";
  const UNKOWN_RESULT = {
    win: 0,
    lose: 0,
    tie: 0,
    winRate: 0,
    total: 0,
    coveragePercent: 100,
  };

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
  function randomC3() {
    community.value = "";
    community.value = randomCard(3);
    invalidate();
  }
  function randomC4() {
    community.value = "";
    community.value = randomCard(4);
    invalidate();
  }
  function randomC5() {
    community.value = "";
    community.value = randomCard(5);
    invalidate();
  }
  function randomA() {
    handA.value = "";
    handA.value = randomCard(2);
    invalidate();
  }
  function randomB() {
    handB.value = "";
    handB.value = randomCard(2);
    invalidate();
  }

  function computeFast() {
    return compute();
  }
  function computeSlow() {
    return compute(0.6);
  }
  function computeVerySlow() {
    return compute(0.3);
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
    randomC5();
    computeFast();
  });
</script>

<svelte:head>
  <title>Poker Simulator</title>
</svelte:head>
<header class="container prose prose-slate text-center dark:prose-invert">
  <h1>Poker Simulator <WavingHand>🃏</WavingHand></h1>
  <small
    >Enter your hand and table configuration. Then let computer calculate the
    winning odds for you 😌</small
  >
</header>
<form class="container prose prose-slate text-center dark:prose-invert">
  <div>
    <label for="hand-a">Your Hand</label>
    <input
      title="Enter 2 cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]"
      bind:this={handA}
      id="hand-a"
      type="text"
      on:change={invalidate}
      value="KsAs"
      pattern={"([2-9tjqkaxTJQKA][scdh]){2}"}
      maxlength="4"
    />
    <button on:click={randomA}>🎲</button>
  </div>
  <div>
    <Hand cards={handAInt} fill={2} />
  </div>
  <div>
    <label for="community">Community Cards</label>
    <input
      title="Enter 3-5 cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]"
      bind:this={community}
      id="community"
      type="text"
      value="2d9h2hJhKh"
      maxlength="10"
      pattern={"([2-9tjqkaxTJQKA][scdh]){3,5}"}
      on:change={invalidate}
    />
    <button on:click={randomC5}>🎲 </button>
  </div>
  <div>
    <Hand cards={communityInt} fill={5} />
  </div>
  <div>
    <label for="hand-b">Their Hand</label>
    <input
      title="Enter 2 or 0 cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]"
      bind:this={handB}
      id="hand-b"
      type="text"
      on:change={invalidate}
      value="2s2c"
      pattern={"([2-9tjqkaTJQKA][scdh]){0,2}"}
      maxlength="4"
    />
    <button on:click={randomB}>🎲</button>
  </div>
  <div>
    <Hand cards={handBInt} fill={2} />
  </div>
  <div>
    <button on:click={computeFast}>Compute (Fast)</button>
    <button on:click={computeSlow}>Compute (Slow)</button>
    <button on:click={computeSlow}>Compute (Very Slow)</button>
    {#if isWorking}
      <svg
        class="aspec-square my-4 mx-auto w-10 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    {:else if result.total > 0}
      <Result {result} />
    {:else}
      <h3>Press <kbd>Compute</kbd> to see result</h3>
    {/if}
  </div>
</form>

<footer class="container mb-10 text-center opacity-50">
  Made with ♥ by <strong><a href="https://hucanco.de/">hucancode</a></strong><br
  />
  <small>
    Card evaluation algorithm based on bit masking and pre-calculation. <br />
    You can test the accuracy of the algorithm using
    <strong><a href="/specials">this tool</a></strong>
  </small>
</footer>

<style>
  button {
    @apply my-1 mx-auto bg-black px-4 py-1 uppercase text-white only:w-full;
  }
  input {
    @apply border p-1 text-gray-800 valid:border-green-500 invalid:border-2 invalid:border-red-500 disabled:line-through;
  }
  form {
    @apply table;
  }
  form div {
    @apply my-2;
  }
  label,
  input {
    @apply table-cell;
  }
</style>
