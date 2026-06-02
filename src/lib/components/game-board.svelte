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

  const GAME_CODE_HELP =
    "Enter 2 cards for you, 0-2 for them, 3-5 community cards, each card consists of 2 letters (rank and suit) in the form of [2-9TJQKA][scdh]";

  let codeInput;
  export let code;
  let community = [],
    handA = [],
    handB = [];
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function updateArrayFromText() {
    if (!codeInput.validity.valid) {
      community = [];
      handA = [];
      handB = [];
      return;
    }
    const arr = code.split(HAND_DELIMETER);
    handA = handTextToArray(arr[0]);
    handB = handTextToArray(arr[1]);
    community = handTextToArray(arr[2]);
    dispatch("updated");
  }

  function updateTextFromArray() {
    const a = handArrayToText(handA);
    const b = handArrayToText(handB);
    const c = handArrayToText(community);
    code = a + HAND_DELIMETER + b + HAND_DELIMETER + c;
    dispatch("updated");
  }

  export function updateWithText(str) {
    code = str;
    codeInput.value = code;
    updateArrayFromText();
  }

  export function randomize() {
    let pool = Array(52)
      .fill()
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5);
    handA = pool.slice(0, 2);
    community = pool.slice(5, 9 + Math.floor(Math.random() * 2));
    updateTextFromArray();
  }
  export function isValid() {
    return codeInput.validity.valid;
  }
  export function getCommunity() {
    const arr = code.split(HAND_DELIMETER);
    return arr[2];
  }
  export function getHandB() {
    const arr = code.split(HAND_DELIMETER);
    return arr[1];
  }
  export function getHandA() {
    const arr = code.split(HAND_DELIMETER);
    return arr[0];
  }
</script>

<div>
  <div class="code-row">
    <input
      title={GAME_CODE_HELP}
      bind:this={codeInput}
      bind:value={code}
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
      class="dice-btn"
      on:click|preventDefault={randomize}
      {disabled}>🎲</button
    >
  </div>
  <div class="labels-row">
    <strong>Your Cards </strong>
    <strong>Their Cards </strong>
  </div>
  <div class="hands-row">
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
  <strong class="community-label">Community Cards</strong>
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
  .code-row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.125rem;
    margin: 0.5rem 0;
  }
  input {
    width: 100%;
    border: 1px solid #d1d5db;
    padding: 0.25rem;
    text-align: center;
    color: #1f2937;
  }
  input:valid {
    border-color: #22c55e;
  }
  input:invalid {
    border-color: #ef4444;
  }
  input[type="text"] + label {
    position: absolute;
    top: -25%;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    padding: 0 0.5rem;
    font-size: 0.875rem;
    color: #fff;
  }
  .dice-btn {
    margin: 0.5rem;
    user-select: none;
    background: #000;
    padding: 0.25rem 1.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #fff;
  }
  .labels-row {
    margin-top: 0.5rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .hands-row {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .community-label {
    display: block;
    width: 100%;
    text-align: center;
  }
</style>
