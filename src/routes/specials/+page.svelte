<script>
  import { onMount } from "svelte";
  import { handMaskToArray, handArrayToText } from "$lib/poker/cards";
  import {
    straightFlush,
    fourOfAKind,
    fullHouse,
    flush,
    straight,
    threeOfAKind,
    twoPair,
    pair,
  } from "$lib/poker/special-hands";
  import Hand from "$lib/components/hand-visualizer.svelte";
  let handMask, handArray, handText;

  let history = [];
  const HISTORY_SIZE = 30;
  function randomCard(pool) {
    const i = Math.floor(Math.random() * pool.length);
    handMask = pool[i];
    handArray = handMaskToArray(handMask);
    handText = handArrayToText(handArray);
    pushHistory(handArray);
  }
  function pushHistory(arr) {
    history.push(handArray);
    if (history.length > HISTORY_SIZE) {
      history.shift();
    }
    history = history;
  }
  function randomSF() {
    randomCard(straightFlush);
  }
  function random4X() {
    randomCard(fourOfAKind);
  }
  function random3X2X() {
    randomCard(fullHouse);
  }
  function randomFlush() {
    randomCard(flush);
  }
  function randomStraight() {
    randomCard(straight);
  }
  function random3X() {
    randomCard(threeOfAKind);
  }
  function random2X2() {
    randomCard(twoPair);
  }
  function random2X() {
    randomCard(pair);
  }

  onMount(() => {
    randomSF();
  });
</script>

<svelte:head>
  <title>Poker Combinations Tester</title>
</svelte:head>

<form>
  <h1>Poker Combinations</h1>
  <small>
    This page serve as a test for the hand evaluation algorithm. Ideally when
    you ask for a <strong>Full House</strong> the program must produce a random
    <strong>Full House (A triplet and a pair)</strong> combination. Press buttons
    below to get a special combinations
  </small>
  <div>
    <button on:click={randomSF}>🎲 Straight Flush</button>
    <button on:click={random4X}>🎲 Four of a Kind</button>
    <button on:click={random3X2X}>🎲 Full House</button>
    <button on:click={randomFlush}>🎲 Flush</button>
  </div>
  <div>
    <button on:click={randomStraight}>🎲 Straight</button>
    <button on:click={random3X}>🎲 Three of a Kind</button>
    <button on:click={random2X2}>🎲 Two Pairs</button>
    <button on:click={random2X}>🎲 Pair</button>
  </div>
  <div class="flex flex-col-reverse">
    {#each history as hand}
      <Hand cards={hand} />
    {/each}
  </div>
</form>

<style>
  button {
    @apply my-1 mx-auto bg-black px-4 py-1 uppercase text-white only:w-full;
  }
  input {
    @apply border p-1 text-gray-800 valid:border-green-500 invalid:border-2 invalid:border-red-500;
  }
  form {
    @apply container prose prose-slate table text-center dark:prose-invert;
  }
  form div {
    @apply my-2 flex justify-center gap-1;
  }
  label,
  input {
    @apply table-cell;
  }
</style>
