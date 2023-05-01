<script>
  import Card from "$lib/components/card.svelte";
  import Picker from "$lib/components/card-picker.svelte";
  import { createEventDispatcher } from "svelte";
  let picker;
  export let disabled = true;
  export let usedCards = [];
  export let cards = [];
  export let max = 5;
  export let min = 3;
  const dispatch = createEventDispatcher();

  function notifyRemove(event) {
    cards = cards;
    dispatch("remove", { card: event.detail.card });
  }

  function notifyAdd(event) {
    cards = cards;
    dispatch("add", { card: event.detail.card });
  }

  function open() {
    picker.showModal();
    disabled = true;
  }

  function close() {
    picker.close();
    disabled = false;
  }
</script>

<button
  type="button"
  {disabled}
  class="mx-auto flex max-w-full flex-wrap items-center justify-center gap-0.5 font-bold md:gap-1"
  on:click={open}
>
  {#each Array(Math.max(cards.length, max)) as _, i}
    <Card card={i < cards.length ? cards[i] : -1} />
  {/each}
</button>

<dialog
  bind:this={picker}
  on:click|self={close}
  on:keypress={() => {}}
  class="pb-20"
>
  <div class="mx-auto flex w-max flex-col items-center justify-center">
    <div class="flex items-center justify-between gap-2">
      <p class="bg-black p-2 text-white">
        Selected <b class:invalid={cards.length < min}>{cards.length}/{max}</b> cards
      </p>
      <button
        type="button"
        class="cursor-pointer bg-black py-2 px-6 font-bold text-white"
        on:click={close}>X</button
      >
    </div>
    <Picker
      {cards}
      {usedCards}
      {max}
      on:remove={notifyRemove}
      on:add={notifyAdd}
    />
  </div>
</dialog>

<style>
  .invalid {
    @apply text-red-500;
  }
</style>
