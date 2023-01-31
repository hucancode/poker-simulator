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
  function toggle(event) {
    if (!selectable) return;
    event.stopPropagation();
    dispatch("selectedChange", { selected: !selected });
  }
</script>

<label
  is-pair={paired}
  class="aspect-[2/2.5] w-16 animate-bg-pingpong rounded-md bg-4x-width p-0.5"
>
  <input checked={selected} enabled={selectable} on:change={toggle} type="checkbox" />
  <div
    class="flex h-full w-full select-none flex-col items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-gray-100/90 text-gray-800"
    {selected}
  >
    <div class="text-xs uppercase leading-none">
      {#if suited && !offSuited}
        suited
      {:else if !suited && offSuited}
        off suited
      {/if}
    </div>
    <div class="text-2xl md:text-3xl">
      {poker.readableRanks[Math.floor(rank)] ?? ""}{extended ? "+" : ""}
    </div>
  </div>
</label>

<style>
  input {
    @apply hidden;
  }
  div[selected="true"] {
    @apply bg-orange-200;
  }
  label[is-pair="false"] {
    @apply bg-gray-200;
  }
  label[is-pair="true"] {
    @apply z-10 bg-rainbow;
  }
</style>
