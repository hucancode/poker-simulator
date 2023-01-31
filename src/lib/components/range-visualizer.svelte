<script>
  import * as poker from "$lib/poker/cards";
  import Card from "$lib/components/card-range.svelte";
  import RangePicker from "$lib/components/range-picker.svelte";
  import { createEventDispatcher } from "svelte";
  let picker;
  export let disabled = false;
  export let config = {
    r1: 2,
    r2: 3,
    suited: true,
    offSuited: true,
    extended: true,
  };
  const dispatch = createEventDispatcher();

  function rangeUpdated(event) {
    config = config;
    dispatch("rangeUpdated", config);
  }
</script>

<button type="button"
  {disabled}
  class="mx-auto flex max-w-full flex-wrap items-center justify-center gap-0.5 font-bold md:gap-1"
  on:click={() => picker.showModal()}
>
  <Card rank={config.r1} paired={config.r1 == config.r2} />
  <Card
    rank={config.r2}
    paired={config.r1 == config.r2}
    suited={config.suited}
    offSuited={config.offSuited}
    extended={config.extended}
  />
</button>
<dialog
  class="pb-20"
  bind:this={picker}
  on:click|self={() => picker.close()}
  on:keypress={() => {}}
>
  <div
    class="w-max max-w-full h-full mx-auto flex flex-col items-center justify-center"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="bg-black p-2 text-white">
        Selected <b>
          {#if config.r1 == config.r2}
            Pair of
            {poker.readableRanks[Math.floor(config.r1)]}
          {:else if config.suited && !config.offSuited}
            Suited
            {poker.readableRanks[Math.floor(config.r1)]}-{poker.readableRanks[
              Math.floor(config.r2)
            ]}
          {:else if config.suited && !config.offSuited}
            Off-suited
            {poker.readableRanks[Math.floor(config.r1)]}-{poker.readableRanks[
              Math.floor(config.r2)
            ]}
          {:else}
            {poker.readableRanks[Math.floor(config.r1)]}-{poker.readableRanks[
              Math.floor(config.r2)
            ]}
          {/if}
          {#if config.extended}
            or higher
          {/if}
        </b>
      </p>
      <button type="button"
        class="bg-black py-2 px-6 font-bold text-white"
        on:click={() => picker.close()}>X</button
      >
    </div>
    <RangePicker {config} on:rangeUpdated={rangeUpdated} />
  </div>
</dialog>
