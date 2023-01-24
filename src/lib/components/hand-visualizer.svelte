<script>
  import Card from "$lib/components/card.svelte";
  import Picker from "$lib/components/card-picker.svelte";
  import { createEventDispatcher } from "svelte";
  let picker;
  export let usedCards = [];
  export let cards = [];
  export let fill = 0;
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
  {#each Array(Math.max(cards.length, fill)) as _, i}
    <Card card={i < cards.length ? cards[i] : -1} />
  {/each}
</div>
<div
  class="picker top-0 left-0 flex h-full w-full flex-col items-center justify-center bg-black/20 pb-20 backdrop-blur"
  enabled={isPicking}
  on:click={() => {
    isPicking = false;
  }}
>
  <div class="flex items-center justify-between gap-2">
    <p>Selected <b>{cards.length}/{fill}</b> cards</p>
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
    max={fill}
    on:remove={notifyRemove}
    on:add={notifyAdd}
  />
</div>

<style>
  p {
    @apply bg-black p-2 text-white;
  }
  span {
    @apply cursor-pointer bg-black py-2 px-6 font-bold text-white;
  }
  div.picker[enabled="true"] {
    @apply fixed z-40;
  }

  div.picker[enabled="false"] {
    @apply hidden;
  }
</style>
