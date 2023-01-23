<script>
  import { createEventDispatcher } from "svelte";
  import * as poker from "$lib/poker/cards";
  export let card = 0;
  export let selectable = false;
  export let selected = false;
  export let narrow = false;

  function getCardRank() {
    const ret = poker.ranks[Math.floor(card / 4)];
    return ret == "T" ? "10" : ret;
  }

  function isHighCard() {
    return card >= 8 * 4; // JQKA
  }

  function getCardSymbol() {
    return poker.suitSymbols[Math.floor(card % 4)];
  }

  function isRedCard() {
    return Math.floor(card % 4) >= 2;
  }

  const dispatch = createEventDispatcher();
  function toggleSelected() {
    if (!selectable) return;
    selected = !selected;
    dispatch("selectedChange", { selected });
  }
</script>

{#if card >= 0}
  <div
    on:click={toggleSelected}
    is-high={isHighCard()}
    {narrow}
    class="animate-bg-pingpong rounded-t-md bg-4x-width p-0.5 pb-0"
  >
    <div
      class="relative select-none rounded-t-md border border-b-0 border-gray-300 bg-gray-100/90 px-3 pt-2 text-gray-800"
      {selected}
      is-red={isRedCard()}
    >
      <div class="absolute top-0.5 left-0.5 leading-none">
        {getCardRank() ?? ""}
      </div>
      <div class="text-2xl md:text-4xl">
        {getCardSymbol() ?? ""}
      </div>
    </div>
  </div>
{:else}
  <div
    class="overflow-hidden rounded-t-md border-2 border-neutral-400 bg-white bg-double-width p-0.5 pb-0"
  >
    <div class="h-10 w-12 rounded-t-md bg-sky-500 bg-diagonal-stripe" />
  </div>
{/if}

<style>
  div[narrow="true"] {
    @apply -mx-4;
  }
  div[selected="true"] {
    @apply bg-orange-200;
  }
  div[is-red="true"] {
    @apply text-red-500;
  }
  div[is-high="false"] {
    @apply bg-white;
  }
  div[is-high="true"] {
    @apply bg-rainbow;
  }
</style>
