<script>
  export let result = {
    win: 0,
    lose: 0,
    tie: 0,
  };
</script>

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

<style>
  h3[negative="true"] {
    @apply text-red-500;
  }
  h3[positive="true"] {
    @apply text-green-600;
  }
</style>
