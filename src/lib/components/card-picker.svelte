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

<div
  class="mx-auto grid max-h-96 w-max grid-cols-4 gap-0.5 overflow-y-scroll px-10 py-4 font-bold md:max-h-full md:grid-cols-8 md:gap-1 md:overflow-hidden"
>
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
