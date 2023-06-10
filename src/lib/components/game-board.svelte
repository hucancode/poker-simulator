<script>
  import { createEventDispatcher } from "svelte";
  import { handTextToArray, handArrayToText } from "$lib/poker/cards";
  import Hand from "$lib/components/hand-visualizer.svelte";

  const HAND_DELIMETER = ",";
  const COMMUNITY_TEXT_REGEX = "([2-9TJQKA][scdh]){3,5}";
  const MY_HAND_TEXT_REGEX = "([2-9TJQKA][scdh]){2}";
  const THEIR_HAND_TEXT_REGEX = "([2-9TJQKA][scdh]){0,2}";

  const GAME_CODE_REGEX =
    MY_HAND_TEXT_REGEX +
    HAND_DELIMETER +
    THEIR_HAND_TEXT_REGEX +
    HAND_DELIMETER +
    COMMUNITY_TEXT_REGEX;

  // TODO: explain more about the game state notation, value input, range input, ...
  const GAME_CODE_HELP =
    "Enter 2 cards for you, 0-2 for them, 3-5 community cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]";

  export let gameCodeInput;
  let community = [],
    handA = [],
    handB = [];
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
    handA = handTextToArray(arr[0]);
    handB = handTextToArray(arr[1]);
    community = handTextToArray(arr[2]);
    dispatch("updated");
  }

  function updateTextFromArray() {
    const a = handArrayToText(handA);
    const b = handArrayToText(handB);
    const c = handArrayToText(community);
    gameCodeInput.value = a + HAND_DELIMETER + b + HAND_DELIMETER + c;
    dispatch("updated");
  }

  export function updateWithText(str) {
    gameCodeInput.value = str;
    updateArrayFromText();
  }

  export function randomize() {
    let pool = Array(52)
      .fill()
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5);
    handA = pool.slice(0, 2);
    // handB = pool.slice(2, 4);
    community = pool.slice(5, 10);
    updateTextFromArray();
  }
  export function isValid() {
    return gameCodeInput.validity.valid;
  }
  export function getCommunity() {
    const arr = gameCodeInput.value.split(HAND_DELIMETER);
    return arr[2];
  }
  export function getHandB() {
    const arr = gameCodeInput.value.split(HAND_DELIMETER);
    return arr[1];
  }
  export function getHandA() {
    const arr = gameCodeInput.value.split(HAND_DELIMETER);
    return arr[0];
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
    <strong>Your Cards </strong>
    <strong>Their Cards </strong>
  </div>
  <div class="mb-4 flex items-center justify-between gap-2">
    <Hand
      {disabled}
      cards={handA}
      max={2}
      min={2}
      usedCards={handB.concat(community)}
      on:remove={() => {
        handA = handA;
        updateTextFromArray();
      }}
      on:add={() => {
        handA = handA;
        updateTextFromArray();
      }}
    />
    <strong>VS</strong>
    <Hand
      {disabled}
      cards={handB}
      max={2}
      min={0}
      usedCards={handA.concat(community)}
      on:remove={() => {
        handB = handB;
        updateTextFromArray();
      }}
      on:add={() => {
        handB = handB;
        updateTextFromArray();
      }}
    />
  </div>
  <strong class="w-full text-center">Community Cards</strong>
  <Hand
    {disabled}
    cards={community}
    max={5}
    min={3}
    usedCards={handA.concat(handB)}
    on:remove={() => {
      community = community;
      updateTextFromArray();
    }}
    on:add={() => {
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
