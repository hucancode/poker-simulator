<script>
  import * as poker from "$lib/poker/cards";
  export let cards = [];
  export let fill = 0;

  function getCardRank(card) {
    const ret = poker.ranks[Math.floor(card / 4)];
    return ret == "T" ? "10" : ret;
  }

  function isHighCard(card) {
    return card >= 8 * 4; // JQKA
  }

  function getCardSymbol(card) {
    return poker.suitSymbols[Math.floor(card % 4)];
  }

  function isRedCard(card) {
    return Math.floor(card % 4) >= 2;
  }
</script>

<div
  class="flex max-w-full flex-wrap items-center justify-center gap-0.5 font-bold md:gap-1"
>
  {#if Math.max(cards.length, fill) > 0}
    {#each Array(Math.max(cards.length, fill)) as _, i}
      {#if i < cards.length}
        <div
          is-high={isHighCard(cards[i])}
          class="animate-bg-pingpong-fast bg-double-width rounded-t-md p-0.5 pb-0"
        >
          <div
            class="relative select-none rounded-t-md border border-b-0 border-gray-300 bg-gray-100/90 px-3 pt-2 text-gray-800"
            is-red={isRedCard(cards[i])}
          >
            <div class="absolute top-0.5 left-0.5 leading-none">
              {getCardRank(cards[i]) ?? ""}
            </div>
            <div class="text-2xl md:text-4xl">
              {getCardSymbol(cards[i]) ?? ""}
            </div>
          </div>
        </div>
      {:else}
        <div
          class="bg-double-width overflow-hidden rounded-t-md border border-neutral-400 bg-white p-0.5 pb-0"
        >
          <div
            class="aspect-square w-12 rounded-t-md bg-sky-500 bg-diagonal-stripe"
          />
        </div>
      {/if}
    {/each}
  {:else}
    <div
      class="relative select-none rounded-t-md border bg-gray-100 px-3 pt-2 text-gray-800"
    >
      <div class="text-4xl">★</div>
    </div>
  {/if}
</div>

<style>
  div[is-red="true"] {
    @apply text-red-500;
  }
  div[is-high="false"] {
    @apply bg-white;
  }
  div[is-high="true"] {
    @apply bg-rainbow2;
  }
</style>
