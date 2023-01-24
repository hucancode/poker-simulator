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
    console.log("hand vis cards", cards);
    dispatch("remove", { card: event.detail.card });
  }

  function notifyAdd(event) {
    cards = cards;
    console.log("hand vis cards", cards);
    dispatch("add", { card: event.detail.card });
  }
</script>

<div
  class="flex max-w-full flex-wrap items-center justify-center gap-0.5 font-bold md:gap-1"
  on:click={() => {
    isPicking = !isPicking;
  }}
>
  {#each Array(Math.max(cards.length, fill)) as _, i}
    <Card card={i < cards.length ? cards[i] : -1} />
  {/each}
</div>
<div
  class="picker top-0 left-0 flex h-full w-full flex-col items-center bg-black/20"
  enabled={isPicking}
>
  <div class="flex items-center justify-between gap-2">
    <p>Selected {cards.length}/{fill} cards</p>
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
    @apply bg-black py-2 px-4 font-bold text-white;
  }
  div.picker[enabled="true"] {
    @apply fixed z-40;
  }

  div.picker[enabled="false"] {
    @apply hidden;
  }
</style>
