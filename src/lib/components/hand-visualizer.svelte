<script>
  import Card from "$lib/components/card.svelte";
  export let cards = [];
  export let fill = 0;
</script>

<div
  class="flex max-w-full flex-wrap items-center justify-center gap-0.5 font-bold md:gap-1"
>
  {#each Array(Math.max(cards.length, fill)) as _, i}
    <Card card={i < cards.length ? cards[i] : -1} />
  {/each}
</div>
