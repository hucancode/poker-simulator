<script>
  import { fade, scale } from "svelte/transition";
  import Card from "$lib/components/card-range.svelte";
  import RangePicker from "$lib/components/range-picker.svelte";
  import { createEventDispatcher } from "svelte";
  let picker;
  export let config = {
    r1: 2,
    r2: 3,
    suited: true,
    offSuited: true,
    extended: true,
  };
  let isPicking = false;
  const dispatch = createEventDispatcher();

  function rangeUpdated(event) {
    console.log("dispatching rangeUpdated event", config);
    config = config;
    dispatch("rangeUpdated", config);
  }
</script>

<button
  class="flex max-w-full cursor-pointer flex-wrap items-center justify-center gap-0.5 font-bold md:gap-1"
  on:click={() => {
    isPicking = !isPicking;
  }}
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
{#if isPicking}
  <div
    transition:fade
    class="picker top-0 left-0 h-full w-full bg-black/20 pb-20 backdrop-blur duration-500"
    on:click={() => {
      // isPicking = false;
    }}
  >
    <div
      transition:scale={{ start: 0.8, duration: 200 }}
      class="flex h-full w-full flex-col items-center justify-center"
    >
      <div class="flex items-center justify-between gap-2">
        <p>Selected cards</p>
        <span
          on:click={() => {
            isPicking = false;
          }}>X</span
        >
      </div>
      <RangePicker bind:this={picker} {config} on:rangeUpdated={rangeUpdated} />
    </div>
  </div>
{/if}

<style>
  .invalid {
    @apply text-red-500;
  }
  p {
    @apply bg-black p-2 text-white;
  }
  span {
    @apply cursor-pointer bg-black py-2 px-6 font-bold text-white;
  }
  div.picker {
    @apply fixed z-40;
  }
</style>
