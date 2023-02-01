<script>
  import { createEventDispatcher } from "svelte";
  import * as poker from "$lib/poker/cards";
  export let card = 0;
  export let used = false;
  export let selectable = false;
  export let selected = false;

  const dispatch = createEventDispatcher();
  function toggle(event) {
    if (!selectable) return;
    event.stopPropagation();
    if (used) return;
    dispatch("selectedChange", { selected: !selected });
  }
</script>

<label
  is-high={card >= 9 * 4}
  class="relative aspect-[2/2.5] w-16 rounded-md p-0.5"
>
  <input
    checked={selected}
    enabled={selectable}
    type="checkbox"
    on:change={toggle}
  />
  <div
    class="relative flex h-full w-full select-none items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-gray-100 text-gray-800"
    {selected}
    is-red={Math.floor(card % 4) >= 2}
  >
    <div class="absolute top-1 left-1 leading-none">
      {poker.readableRanks[Math.floor(card / 4)] ?? ""}
    </div>
    <div class="text-2xl md:text-4xl">
      {poker.suitSymbols[Math.floor(card % 4)] ?? ""}
    </div>
    {#if used || card < 0}
      <div
        class="absolute top-0 left-0 h-full w-full bg-diagonal-stripe text-black/80"
      />
    {/if}
  </div>
</label>

<style>
  input {
    @apply hidden;
  }
  div[selected="true"] {
    @apply bg-orange-200;
  }
  div[is-red="true"] {
    @apply text-red-500;
  }
  label[is-high="false"] {
    @apply bg-gray-200;
  }
  label[is-high="true"] {
    @apply relative overflow-hidden;
  }
  label[is-high="true"]::before {
    @apply absolute -z-10 blur animate-rotate;
    content: "";
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    background-repeat: no-repeat;
    background-size: 50% 50%, 50% 50%;
    background-position: 0 0, 100% 0, 100% 100%, 0 100%;
    background-image: linear-gradient(#399953, #399953),
      linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33),
      linear-gradient(#377af5, #377af5);
  }
</style>
