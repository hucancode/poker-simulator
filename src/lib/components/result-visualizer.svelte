<script>
  export let result = {
    win: 0,
    lose: 0,
    tie: 0,
    total: 0,
    covered: 0,
    time: 0,
    interrupted: false,
  };
</script>

{#if result.total == 0 || result.covered == 0}
  <h2>No computation has been made</h2>
{:else if result.total == 1}
  <h3 positive={result.win == 1} negative={result.lose == 1}>
    {#if result.win == 1}
      <big>🫅</big><br />
      Congrats, you won!
    {:else if result.lose == 1}
      <big>🥹</big><br />
      You won my heart. Not the game, but my heart
    {:else if result.tie == 1}
      <big>🤝</big><br />
      It's a tie
    {/if}
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
      In the matter of
      <em>{Math.floor(result.time / 1000)} seconds</em>,
    {/if}
    {#if result.interrupted}
      I have fast-forwarded into the future and saw {result.covered} outcomes
    {:else if result.covered == result.total}
      I have fast-forwarded into the future and saw all <em>{result.total}</em> possible
      outcomes
    {:else}
      I have fast-forwarded into the future and saw
      <em
        >{result.covered} ({((result.covered / result.total) * 100).toFixed(
          2
        )}%)</em
      >
      futures (of total <em>{result.total}</em>)
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
