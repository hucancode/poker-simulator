<script>
  import * as poker from "$lib/poker/cards";
  export let cards = [];

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
  class="my-2 flex max-w-full flex-wrap items-center justify-center gap-1 font-bold"
>
  {#if cards.length > 0}
    {#each cards as card}
      {#if card >= 0}
        <div
          is-high={isHighCard(card)}
          class="animate-bg-pingpong-fast bg-double-width rounded-t-md p-0.5 pb-0"
        >
          <div
            class="relative select-none rounded-t-md border border-b-0 border-gray-300 bg-gray-100/90 px-3 pt-2 text-gray-800"
            is-red={isRedCard(card)}
          >
            <div class="absolute top-0 left-1 text-sm">
              {getCardRank(card) ?? ""}
            </div>
            <div class="text-4xl">{getCardSymbol(card) ?? ""}</div>
          </div>
        </div>
      {:else}
        <div class="bg-double-width rounded-t-md p-px pb-0">
          <div
            class="relative select-none rounded-t-md border border-b-0 border-gray-300 bg-gray-100 px-3 pt-2 text-gray-800"
          >
            <div class="text-4xl">★</div>
          </div>
        </div>
      {/if}
    {/each}
  {:else}
    <div
      class="relative select-none rounded-t-md border bg-gray-100 px-3 pt-2 text-gray-800"
    >
      <div class="absolute top-0 left-1 text-sm">?</div>
      <div class="text-2xl">★</div>
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
