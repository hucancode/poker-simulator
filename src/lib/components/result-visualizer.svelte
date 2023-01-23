<script>
  export let result = {
    win: 0,
    lose: 0,
    tie: 0,
    winRate: 0,
    total: 0,
    coveragePercent: 100,
    time: 0,
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
  <p>
    {#if result.time > 2000}
      Thanks for the
      <em>{Math.floor(result.time / 1000)} seconds</em> wait <big>😅</big>.
    {/if}
    {#if result.win + result.lose + result.tie == result.total}
      The computer has covered all {result.total} possible outcomes
    {:else}
      The computer has gone through
      {result.win + result.lose + result.tie} test runs (of total
      <em>{result.total}</em>
      possible outcomes). Which covers {result.coveragePercent.toFixed(2)}% real
      combinations space
    {/if}
  </p>
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
