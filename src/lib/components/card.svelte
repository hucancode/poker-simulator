<script>
  import { createEventDispatcher } from "svelte";
  import * as poker from "$lib/poker/cards";
  export let card = 0;
  export let used = false;
  export let selectable = false;
  export let selected = false;
  export let narrowX = false;
  export let narrowY = false;

  const dispatch = createEventDispatcher();
  function toggleSelected() {
    console.log("toggle", card, "used=", used, "selectable", selectable);
    if (!selectable) return;
    if (used) return;
    dispatch("selectedChange", { selected: !selected });
  }
</script>

{#if card >= 0}
  <div
    on:click={toggleSelected}
    is-high={card >= 9 * 4}
    narrow-x={narrowX}
    narrow-y={narrowY}
    {card}
    class="animate-bg-pingpong rounded-t-md bg-4x-width p-0.5 pb-0"
  >
    <div
      class="relative select-none rounded-t-md border border-b-0 border-gray-300 bg-gray-100/90 px-3 pt-2 text-gray-800"
      {selected}
      {used}
      is-red={Math.floor(card % 4) >= 2}
    >
      <div class="absolute top-0.5 left-0.5 leading-none">
        {poker.readableRanks[Math.floor(card / 4)] ?? ""}
      </div>
      <div class="text-2xl md:text-4xl">
        {poker.suitSymbols[Math.floor(card % 4)] ?? ""}
      </div>
    </div>
  </div>
{:else}
  <div
    class="relative select-none rounded-t-md border border-b-0 border-gray-300 bg-sky-500 bg-diagonal-stripe px-3 pt-2 text-gray-800"
  >
    <div class="invisible text-2xl md:text-4xl">
      {poker.suitSymbols[0]}
    </div>
  </div>
{/if}

<style>
  div[narrow-x="true"] {
    @apply -mx-4;
  }
  div[narrow-y="true"] {
    @apply -my-1;
  }
  div[used="true"] {
    @apply bg-diagonal-stripe opacity-70;
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
    @apply z-10 bg-rainbow;
  }
</style>
