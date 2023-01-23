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
  {#if result.win == 1}
    <h3>You Win!</h3>
  {:else if result.lose == 1}
    <h3>You Lose!</h3>
  {:else}
    <h3>You Tie!</h3>
  {/if}
{:else}
  <h3>
    Win/Lose/Tie: {result.win}/{result.lose}/{result.tie}
    <span
      class:text-green-600={result.winRate > 50}
      class:text-red-500={result.winRate <= 50}
      >(You win {result.winRate.toFixed(1)}% of the time)</span
    ><br />
  </h3>
  <p>
    The computer has gone through
    {result.win + result.lose + result.tie} test runs (of total {result.total}
    possible outcomes). Which covers {result.coveragePercent.toFixed(2)}% real
    combinations space
  </p>
{/if}
