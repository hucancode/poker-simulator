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

<button type="button" {disabled} class="hand" on:click={open}>
  {#each Array(Math.max(cards.length, max)) as _, i}
    <Card card={i < cards.length ? cards[i] : -1} />
  {/each}
</button>

<dialog
  bind:this={picker}
  on:click|self={close}
  on:keypress={() => {}}
  class="picker-dialog"
>
  <div class="picker-inner">
    <div class="picker-header">
      <p class="header-text">
        Selected <b class:invalid={cards.length < min}>{cards.length}/{max}</b> cards
      </p>
      <button type="button" class="close-btn" on:click={close}>X</button>
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
  .hand {
    margin: 0 auto;
    display: flex;
    max-width: 100%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.125rem;
    font-weight: 700;
  }
  @media (min-width: 768px) {
    .hand {
      gap: 0.25rem;
    }
  }
  .picker-dialog {
    padding-bottom: 5rem;
  }
  .picker-inner {
    margin: 0 auto;
    display: flex;
    width: max-content;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .header-text {
    background: #000;
    padding: 0.5rem;
    color: #fff;
  }
  .close-btn {
    cursor: pointer;
    background: #000;
    padding: 0.5rem 1.5rem;
    font-weight: 700;
    color: #fff;
  }
  .invalid {
    color: #ef4444;
  }
</style>
