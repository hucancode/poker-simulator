<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import {
    handTextToArray,
    handArrayToText,
    rangeTextToConfig,
    rangeConfigToText,
    isRangeNotation,
  } from "$lib/poker/cards";
  import { enumerate, enumerateRange } from "$lib/poker/solver";
  import Hand from "$lib/components/hand-visualizer.svelte";
  import HandRange from "$lib/components/range-visualizer.svelte";

  const HAND_DELIMETER = ",";
  const COMMUNITY_TEXT_REGEX = "([2-9TJQKA][scdh]){3,5}";
  const MY_HAND_FIXED_REGEX = "([2-9TJQKA][scdh]){2}";
  const MY_HAND_RANGE_REGEX = "([2-9TJQKA]{2}[so]?\\+?)";
  const MY_HAND_TEXT_REGEX = `((${MY_HAND_FIXED_REGEX})|(${MY_HAND_RANGE_REGEX}))`;
  const THEIR_HAND_FIXED_REGEX = "([2-9TJQKA][scdh]){0,2}";
  const THEIR_HAND_RANGE_REGEX = "([2-9TJQKA]{2}[so]?\\+?)";
  const THEIR_HAND_TEXT_REGEX = `((${THEIR_HAND_FIXED_REGEX})|(${THEIR_HAND_RANGE_REGEX}))`;

  const GAME_CODE_REGEX =
    MY_HAND_TEXT_REGEX +
    HAND_DELIMETER +
    THEIR_HAND_TEXT_REGEX +
    HAND_DELIMETER +
    COMMUNITY_TEXT_REGEX;

  // TODO: explain more about the game state notation, value input, range input, ...
  const GAME_CODE_HELP =
    "Enter 2 cards for you, 0-2 for them, 3-5 community cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]";

  const DEFAULT_RANGE_CONFIG = {
    r1: 0,
    r2: 0,
    suited: true,
    offSuited: true,
    extended: false,
  };
  let gameCodeInput;
  let community = [],
    handA = [],
    handB = [];
  let rangeA = Object.assign({}, DEFAULT_RANGE_CONFIG);
  let rangeB = Object.assign({}, DEFAULT_RANGE_CONFIG);
  let useRangeForA = false;
  let useRangeForB = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function updateArrayFromText() {
    if (!gameCodeInput.validity.valid) {
      community = [];
      handA = [];
      handB = [];
      return;
    }
    const arr = gameCodeInput.value.split(HAND_DELIMETER);
    useRangeForA = isRangeNotation(arr[0]);
    if (useRangeForA) {
      rangeA = rangeTextToConfig(arr[0]);
    } else {
      handA = handTextToArray(arr[0]);
    }
    useRangeForB = isRangeNotation(arr[1]);
    if (useRangeForB) {
      rangeB = rangeTextToConfig(arr[1]);
    } else {
      handB = handTextToArray(arr[1]);
    }
    community = handTextToArray(arr[2]);
    dispatch("updated");
  }

  function updateTextFromArray() {
    const a = useRangeForA ? rangeConfigToText(rangeA) : handArrayToText(handA);
    const b = useRangeForB ? rangeConfigToText(rangeB) : handArrayToText(handB);
    const c = handArrayToText(community);
    gameCodeInput.value = a + HAND_DELIMETER + b + HAND_DELIMETER + c;
    dispatch("updated");
  }

  export function randomize() {
    let pool = Array(52)
      .fill()
      .map((e, i) => i)
      .sort((a, b) => Math.random() - 0.5);
    useRangeForA = Math.random() > 0.5;
    if (useRangeForA) {
      rangeA.r1 = Math.floor(pool[0] / 4);
      rangeA.r2 = Math.floor(pool[1] / 4);
    } else {
      handA = pool.slice(0, 2);
    }
    useRangeForB = Math.random() > 0.5;
    if (useRangeForB) {
      rangeB.r1 = Math.floor(pool[2] / 4);
      rangeB.r2 = Math.floor(pool[3] / 4);
    } else {
      handB = pool.slice(2, 4);
    }
    community = pool.slice(5, 10);
    updateTextFromArray();
  }
  export function isValid() {
    return gameCodeInput.validity.valid;
  }

  export function getCandidateA() {
    if (useRangeForA) {
      return enumerateRange(rangeA);
    }
    const used = handA.concat(handB).concat(community);
    return enumerate(used, handA, 2);
  }
  export function getCandidateB() {
    if (useRangeForB) {
      return enumerateRange(rangeB);
    }
    const used = handA.concat(handB).concat(community);
    return enumerate(used, handB, 2);
  }
  export function getCandidateC() {
    const used = handA.concat(handB).concat(community);
    return enumerate(used, community, 5);
  }
  function switchHandAToValue() {
    useRangeForA = false;
    if (rangeA != null && handA.length == 0) {
      handA.push(rangeA.r1 * 4);
      handA.push(rangeA.r2 * 4);
      if (handA[0] == handA[1]) {
        handA[1]++;
      }
    }
    updateTextFromArray();
  }
  function switchHandAToRange() {
    useRangeForA = true;
    if (rangeA == null) {
      rangeA = Object.assign({}, DEFAULT_RANGE_CONFIG);
      if (handA.length > 0) {
        rangeA.r1 = rangeA.r2 = Math.floor(handA[0] / 4);
      }
      if (handA.length > 1) {
        rangeA.r2 = Math.floor(handA[1] / 4);
      }
      handA = [];
    }
    updateTextFromArray();
  }
  function switchHandBToValue() {
    useRangeForB = false;
    if (rangeB != null && handB.length == 0) {
      handB.push(rangeB.r1 * 4);
      handB.push(rangeB.r2 * 4);
      if (handB[0] == handB[1]) {
        handB[1]++;
      }
    }
    updateTextFromArray();
  }
  function switchHandBToRange() {
    useRangeForB = true;
    if (rangeB == null) {
      rangeB = Object.assign({}, DEFAULT_RANGE_CONFIG);
      if (handB.length > 0) {
        rangeB.r1 = rangeB.r2 = Math.floor(handB[0] / 4);
      }
      if (handB.length > 1) {
        rangeB.r2 = Math.floor(handB[1] / 4);
      }
      handB = [];
    }
    updateTextFromArray();
  }
</script>

<div>
  <div class="flex items-center gap-0.5">
    <input
      title={GAME_CODE_HELP}
      bind:this={gameCodeInput}
      id="game-code"
      type="text"
      pattern={GAME_CODE_REGEX}
      on:change={updateArrayFromText}
      required
      {disabled}
    />
    <label for="game-code">Game Code</label>
    <button
      type="button"
      class="m-2 select-none bg-black px-4 py-1 px-6 text-xl font-bold uppercase text-white"
      on:click|preventDefault={randomize}
      {disabled}>🎲</button
    >
  </div>
  <div class="mt-6 flex w-full justify-between">
    <strong
      >Your Card
      {#if useRangeForA}
        <button
          type="button"
          {disabled}
          class="text-blue-400"
          on:click={switchHandAToValue}>Range</button
        >
      {:else}
        <button
          type="button"
          {disabled}
          class="text-blue-400"
          on:click={switchHandAToRange}>Values</button
        >
      {/if}
    </strong>
    <strong
      >Their Card
      {#if useRangeForB}
        <button
          type="button"
          {disabled}
          class="text-blue-400"
          on:click={switchHandBToValue}>Range</button
        >
      {:else}
        <button
          type="button"
          {disabled}
          class="text-blue-400"
          on:click={switchHandBToRange}>Values</button
        >
      {/if}
    </strong>
  </div>
  <div class="mb-4 flex items-center justify-between gap-2">
    {#if useRangeForA}
      <HandRange
        {disabled}
        config={rangeA}
        on:rangeUpdated={(e) => {
          rangeA = rangeA;
          updateTextFromArray();
        }}
      />
    {:else}
      <Hand
        {disabled}
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
    {/if}
    <strong>VS</strong>
    {#if useRangeForB}
      <HandRange
        {disabled}
        config={rangeB}
        on:rangeUpdated={(e) => {
          rangeB = rangeB;
          updateTextFromArray();
        }}
      />
    {:else}
      <Hand
        {disabled}
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
    {/if}
  </div>
  <strong class="w-full text-center">Community Cards</strong>
  <Hand
    {disabled}
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
</div>

<style>
  input {
    @apply w-full border p-1 text-center text-gray-800 valid:border-green-500 invalid:border-red-500;
  }
  input[type="text"] + label {
    @apply absolute -top-1/3 left-1/2 -translate-x-1/2 bg-black px-2 text-sm text-white;
  }
  div:has(input[type="text"]) {
    @apply relative mt-6 mb-2;
  }
</style>
