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
  <h3>No computation has been made</h3>
{:else}
  <h3>
    Win/Lose/Tie: {result.win}/{result.lose}/{result.tie}
    <span
      class:text-green-600={result.winRate > 50}
      class:text-red-500={result.winRate <= 50}
      >(You win {result.winRate.toFixed(1)}% of the time)</span
    ><br />
  </h3>
  {#if result.total != 1}
    <p>
      The simulation has done {result.win + result.lose + result.tie} test runs (in
      total of {result.total} possible outcomes). Which covers {result.coveragePercent.toFixed(
        2
      )}% real combinations space
    </p>
  {/if}
{/if}
