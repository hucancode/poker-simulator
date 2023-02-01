<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import Card from "$lib/components/card-range.svelte";
  export let config = {
    r1: 2,
    r2: 3,
    suited: true,
    offSuited: true,
    extended: true,
  };
  const dispatch = createEventDispatcher();
  function selectR1(rank) {
    config.r1 = rank;
    rangeUpdated();
  }
  function selectR2(rank) {
    config.r2 = rank;
    rangeUpdated();
  }
  function rangeUpdated() {
    config = config;
    if (!config.suited && !config.offSuited) {
      config.suited = config.offSuited = true;
    }
    dispatch("rangeUpdated", config);
  }
</script>

<div class="flex flex-wrap items-center justify-center gap-1 p-2">
  <input
    id="suited"
    type="checkbox"
    bind:checked={config.suited}
    on:change={rangeUpdated}
  />
  <label for="suited">Suited</label>
  <input
    id="off-suited"
    type="checkbox"
    bind:checked={config.offSuited}
    on:change={rangeUpdated}
  />
  <label for="off-suited">Unsuited</label>
  <input
    id="extended"
    type="checkbox"
    bind:checked={config.extended}
    on:change={rangeUpdated}
  />
  <label for="extended">Extended</label>
</div>
<div class="flex grow items-stretch">
  <div class="flex grow flex-col justify-between">
    <strong>Card 1</strong>
    <div
      class="mx-auto grid max-h-80 grow grid-cols-2 gap-2 overflow-y-auto px-2 py-2 font-bold md:max-h-full md:grid-cols-4 md:gap-2"
    >
      {#each Array(13)
        .fill()
        .map((e, i) => i) as i}
        <Card
          selectable={true}
          rank={i}
          on:selectedChange={() => {
            selectR1(i);
          }}
          selected={config.r1 == i}
        />
      {/each}
    </div>
  </div>
  <div class="flex grow flex-col justify-between">
    <strong>Card 2</strong>
    <div
      class="mx-auto grid max-h-80 grow grow grid-cols-2 gap-2 overflow-y-auto px-2 py-2 font-bold md:max-h-full md:grid-cols-4 md:gap-2"
    >
      {#each Array(13)
        .fill()
        .map((e, i) => i) as i}
        <Card
          selectable={true}
          rank={i}
          on:selectedChange={() => {
            selectR2(i);
          }}
          suited={config.suited}
          offSuited={config.offSuited}
          extended={config.extended}
          paired={(config.r1 == i || (config.extended && config.r2 <= i)) &&
            config.r1 == config.r2}
          selected={config.r2 == i || (config.extended && config.r2 <= i)}
        />
      {/each}
    </div>
  </div>
</div>

<style>
  input[type="checkbox"] {
    @apply hidden;
  }
  input[type="checkbox"] + label {
    @apply flex justify-between bg-black pl-2 text-left text-sm text-white after:ml-2 after:bg-white after:px-2 after:text-black after:content-['no'] md:text-base;
  }
  input[type="checkbox"]:checked + label {
    @apply after:content-['yes'];
  }
  input[type="checkbox"] + label {
    @apply after:content-['no'];
  }
</style>
