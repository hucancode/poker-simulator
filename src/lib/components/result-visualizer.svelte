<script>
  export let result = {
    win: 0,
    lose: 0,
    tie: 0,
    winRate: 0,
    total: 0,
    coveragePercent: 100,
  };
</script>

{#if result.total == 0}
  <h2>No computation has been made</h2>
{:else if result.total == 1}
  <h3 positive={result.win == 1} negative={result.lose == 1}>
    {result.win == 1
      ? "You Win!"
      : result.lose == 1
      ? "You Lose..."
      : "It's A Tie!"}
  </h3>
{:else}
  <h3>
    Win/Lose/Tie: {result.win}/{result.lose}/{result.tie}
    <span positive={result.winRate > 50} negative={result.winRate <= 50}
      >(You win {result.winRate.toFixed(1)}% of the time)</span
    ><br />
  </h3>
  {#if result.win + result.lose + result.tie == result.total}
    <p>
      The computer has covered all {result.total} possible outcomes
    </p>
  {:else}
    <p>
      The computer has gone through
      {result.win + result.lose + result.tie} test runs (of total {result.total}
      possible outcomes). Which covers {result.coveragePercent.toFixed(2)}% real
      combinations space
    </p>
  {/if}
{/if}

<style>
  h3[negative="true"],
  span[negative="true"] {
    @apply text-red-500;
  }
  h3[positive="true"],
  span[positive="true"] {
    @apply text-green-600;
  }
</style>
