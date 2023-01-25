<script>
  import { fade, scale } from "svelte/transition";
  import Card from "$lib/components/card.svelte";
  import Picker from "$lib/components/card-picker.svelte";
  import { createEventDispatcher } from "svelte";
  let picker;
  export let usedCards = [];
  export let cards = [];
  export let max = 5;
  export let min = 3;
  let isPicking = false;
  const dispatch = createEventDispatcher();

  function notifyRemove(event) {
    cards = cards;
    dispatch("remove", { card: event.detail.card });
  }

  function notifyAdd(event) {
    cards = cards;
    dispatch("add", { card: event.detail.card });
  }
</script>

<div
  class="flex max-w-full cursor-pointer flex-wrap items-center justify-center gap-0.5 font-bold md:gap-1"
  on:click={() => {
    isPicking = !isPicking;
  }}
>
  {#each Array(Math.max(cards.length, max)) as _, i}
    <Card card={i < cards.length ? cards[i] : -1} />
  {/each}
</div>
{#if isPicking}
  <div
    transition:fade
    class="picker top-0 left-0 h-full w-full bg-black/20 pb-20 backdrop-blur duration-500"
    on:click={() => {
      isPicking = false;
    }}
  >
    <div
      transition:scale={{ start: 0.8, duration: 200 }}
      class="flex h-full w-full flex-col items-center justify-center"
    >
      <div class="flex items-center justify-between gap-2">
        <p>
          Selected <b class:invalid={cards.length < min}>{cards.length}/{max}</b
          > cards
        </p>
        <span
          on:click={() => {
            isPicking = false;
          }}>X</span
        >
      </div>
      <Picker
        bind:this={picker}
        {cards}
        {usedCards}
        {max}
        on:remove={notifyRemove}
        on:add={notifyAdd}
      />
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
