<script>
  import { createEventDispatcher } from "svelte";
  import * as poker from "$lib/poker/cards";
  export let rank = 0;
  export let selectable = false;
  export let paired = false;
  export let selected = false;
  export let suited = true;
  export let offSuited = true;
  export let extended = false;

  const dispatch = createEventDispatcher();
  function select(event) {
    if (!selectable) return;
    event.stopPropagation();
    dispatch("selectedChange", { selected: !selected });
  }
</script>

<div
  on:click={select}
  is-pair={paired}
  class="aspect-[2/2.5] w-16 animate-bg-pingpong rounded-md bg-4x-width p-0.5"
>
  <div
    class="relative flex h-full w-full select-none items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-gray-100/90 text-gray-800"
    {selected}
    is-red={suited}
  >
    <div class="absolute top-1 left-1 text-sm leading-none" />
    <div class="text-xl md:text-3xl">
      {poker.readableRanks[Math.floor(rank)] ?? ""}{extended ? "+" : ""}
    </div>
  </div>
</div>

<style>
  div[selectable="true"] {
    @apply cursor-pointer;
  }
  div[selected="true"] {
    @apply bg-orange-200;
  }
  div[is-red="true"] {
    @apply text-red-500;
  }
  div[is-pair="false"] {
    @apply bg-gray-200;
  }
  div[is-pair="true"] {
    @apply z-10 bg-rainbow;
  }
</style>
