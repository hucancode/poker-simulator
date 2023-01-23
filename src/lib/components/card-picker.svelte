<script>
  import { createEventDispatcher } from "svelte";
  import Card from "$lib/components/card.svelte";
  export let cards = [];
  export let usedCards = [];
  const dispatch = createEventDispatcher();
  function toggle(i) {
    if (cards.includes(i)) {
      cards.splice(cards.indexOf(i), 1);
      dispatch("remove", { card: i });
    } else {
      cards.push(i);
      dispatch("add", { card: i });
    }
  }
</script>

<div
  class="flex max-w-full items-center gap-0.5 overflow-x-scroll px-10 py-4 font-bold md:gap-1"
>
  {#each Array(52)
    .map((_, i) => i)
    .filter((e) => !usedCards.includes(e)) as i}
    <Card
      card={i}
      selectable={true}
      selected={cards.includes(i)}
      narrow={true}
    />
  {/each}
</div>
