<script>
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import Card from "$lib/components/card.svelte";
  import { expandNotationToCombos } from "$lib/poker/range.js";

  export let notation = "";
  export let dead = [];
  export let intervalMs = 3000;

  let combos = [];
  let current = null;
  let timer = null;
  let key = 0;

  $: combos = expandNotationToCombos(notation, dead);
  $: total = combos.length;
  $: if (combos.length === 0) {
    current = null;
  } else if (current === null) {
    current = combos[0];
    key += 1;
  }

  function pickNext() {
    if (combos.length === 0) return;
    if (combos.length === 1) {
      current = combos[0];
      return;
    }
    let next;
    let tries = 0;
    do {
      next = combos[Math.floor(Math.random() * combos.length)];
      tries += 1;
    } while (
      current &&
      next[0] === current[0] &&
      next[1] === current[1] &&
      tries < 8
    );
    current = next;
    key += 1;
  }

  onMount(() => {
    timer = setInterval(pickNext, intervalMs);
  });
  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<div class="vd">
  <div class="cards">
    {#if current}
      {#key key}
        <div
          class="combo"
          in:fade={{ duration: 300 }}
          out:fade={{ duration: 300 }}
        >
          <Card card={current[0]} />
          <Card card={current[1]} />
        </div>
      {/key}
    {:else}
      <div class="combo placeholder">
        <Card card={-1} />
        <Card card={-1} />
      </div>
    {/if}
  </div>
</div>

<style>
  .vd {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
  .cards {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 5rem;
  }
  .combo {
    display: flex;
    gap: 0.25rem;
    grid-area: 1 / 1;
  }
  .placeholder {
    opacity: 0.5;
  }
</style>
