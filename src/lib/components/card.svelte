<script>
  import { createEventDispatcher } from "svelte";
  import * as poker from "$lib/poker/cards";
  export let crop = true;
  export let card = 0;
  export let used = false;
  export let selectable = false;
  export let selected = false;

  const dispatch = createEventDispatcher();
  function toggleSelected() {
    console.log("toggle", card, "used=", used, "selectable", selectable);
    if (!selectable) return;
    if (used) return;
    dispatch("selectedChange", { selected: !selected });
  }
</script>

<div
  on:click={toggleSelected}
  is-high={card >= 9 * 4}
  {selectable}
  class="aspect-[2/2.5] w-16 animate-bg-pingpong rounded-md bg-4x-width p-0.5"
>
  <div
    class="relative flex h-full w-full select-none items-center justify-center rounded-md border border-gray-300 bg-gray-100/90 text-gray-800"
    {selected}
    {used}
    is-valid={card >= 0}
    is-red={Math.floor(card % 4) >= 2}
  >
    <div class="absolute top-1 left-1 leading-none">
      {poker.readableRanks[Math.floor(card / 4)] ?? ""}
    </div>
    <div class="text-2xl md:text-4xl">
      {poker.suitSymbols[Math.floor(card % 4)] ?? ""}
    </div>
  </div>
</div>

<style>
  div[selectable="true"] {
    @apply cursor-pointer;
  }
  div[used="true"] {
    @apply bg-diagonal-stripe;
  }
  div[is-valid="false"] > div {
    @apply invisible;
  }
  div[is-valid="false"] {
    @apply bg-diagonal-stripe;
  }
  div[selected="true"] {
    @apply bg-orange-200;
  }
  div[is-red="true"] {
    @apply text-red-500;
  }
  div[is-high="false"] {
    @apply bg-gray-200;
  }
  div[is-high="true"] {
    @apply z-10 bg-rainbow;
  }
</style>
