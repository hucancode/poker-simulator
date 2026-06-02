<script>
  import { createEventDispatcher } from "svelte";
  import Card from "$lib/components/card.svelte";
  export let cards = [];
  export let usedCards = [];
  export let max = 5;
  const dispatch = createEventDispatcher();

  function toggle(i) {
    if (cards.includes(i)) {
      cards.splice(cards.indexOf(i), 1);
      dispatch("remove", { card: i });
    } else {
      if (cards.length >= max) {
        return;
      }
      cards.push(i);
      dispatch("add", { card: i });
    }
  }
</script>

<div class="grid">
  {#each Array(52)
    .fill()
    .map((e, i) => i) as i}
    <Card
      card={i}
      on:selectedChange={() => {
        toggle(i);
      }}
      selectable={true}
      used={usedCards.includes(i)}
      selected={cards.includes(i)}
    />
  {/each}
</div>

<style>
  .grid {
    margin: 0 auto;
    display: grid;
    max-height: 24rem;
    width: max-content;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem;
    overflow-y: auto;
    padding: 0.5rem;
    font-weight: 700;
  }
  @media (min-width: 768px) {
    .grid {
      max-height: none;
      grid-template-columns: repeat(8, minmax(0, 1fr));
      gap: 1rem;
    }
  }
</style>
