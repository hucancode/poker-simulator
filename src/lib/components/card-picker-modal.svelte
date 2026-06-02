<script>
  import { createEventDispatcher } from "svelte";
  import Card from "$lib/components/card.svelte";

  export let cards = [];
  export let usedCards = [];
  export let max = 5;
  export let min = 3;
  export let title = "Pick cards";
  export let open = false;

  const dispatch = createEventDispatcher();
  let dialog;

  $: if (dialog) {
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }

  function toggle(i) {
    if (usedCards.includes(i)) return;
    if (cards.includes(i)) {
      cards = cards.filter((x) => x !== i);
    } else {
      if (cards.length >= max) return;
      cards = [...cards, i];
    }
    dispatch("change", { cards });
  }

  function close() {
    open = false;
    dispatch("close");
  }
</script>

<dialog
  bind:this={dialog}
  on:close={close}
  on:click|self={close}
  class="modal"
>
  <div class="inner" on:click|stopPropagation role="presentation">
    <header>
      <h3>{title}</h3>
      <span class="count" class:invalid={cards.length < min}>
        {cards.length} / {max}
      </span>
    </header>

    <div class="picked-row">
      {#each Array(max) as _, i}
        <Card card={i < cards.length ? cards[i] : -1} />
      {/each}
    </div>

    <div class="grid">
      {#each Array(52) as _, i}
        <Card
          card={i}
          selectable
          used={usedCards.includes(i)}
          selected={cards.includes(i)}
          on:selectedChange={() => toggle(i)}
        />
      {/each}
    </div>

    <footer>
      <button type="button" class="done" on:click={close}>Done</button>
    </footer>
  </div>
</dialog>

<style>
  .modal {
    border: 0;
    padding: 0;
    background: transparent;
    max-width: 100vw;
    max-height: 100vh;
  }
  .modal::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
  .inner {
    background: var(--bg, #fff);
    color: var(--fg, #111);
    padding: 0.75rem;
    width: min(100vw, 32rem);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  header h3 {
    margin: 0;
    font-size: 1rem;
    flex: 1;
  }
  .count {
    font-family: ui-monospace, monospace;
    font-weight: 700;
  }
  .count.invalid {
    color: #b91c1c;
  }
  .picked-row {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    flex-wrap: wrap;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.375rem;
    overflow-y: auto;
    padding: 0.25rem;
  }
  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(8, minmax(0, 1fr));
      gap: 0.5rem;
    }
  }
  footer {
    display: flex;
    justify-content: center;
  }
  .done {
    background: #000;
    color: #fff;
    border: 0;
    padding: 0.5rem 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
  }
</style>
