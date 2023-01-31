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
    class="flex h-full w-full select-none flex-col items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-gray-100 text-gray-800"
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
    @apply relative overflow-hidden;
  }
  label[is-pair="true"]::before {
    @apply animate-rotate blur absolute -z-10;
    content: '';
		left: -50%;
		top: -50%;
		width: 200%;
		height: 200%;
		background-repeat: no-repeat;
		background-size: 50% 50%, 50% 50%;
		background-position: 0 0, 100% 0, 100% 100%, 0 100%;
		background-image: linear-gradient(#399953, #399953), linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33), linear-gradient(#377af5, #377af5);
  }
</style>
