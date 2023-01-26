<script>
  import { onMount } from "svelte";
  import {
    Chart,
    Colors,
    PieController,
    ArcElement,
    Legend,
    Tooltip,
  } from "chart.js";
  export let result = {
    win: 0,
    lose: 0,
    tie: 0,
    total: 0,
    covered: 0,
    time: 0,
    interrupted: false,
  };
  let canvas;
  onMount(() => {
    Chart.register(PieController, ArcElement, Colors, Legend, Tooltip);
    let chart = new Chart(canvas, {
      type: "pie",
      data: {
        labels: ["Win", "Lose", "Tie"],
        datasets: [
          {
            data: [result.win, result.lose, result.tie],
            backgroundColor: [
              "rgb(255, 205, 86)",
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
            ],
          },
        ],
      },
      options: {
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 20
                    }
                }
            }
        }
    },
    });
    return () => {
      chart.destroy();
      chart = null;
    };
  });
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
  <canvas class="mx-auto max-w-xs p-10" bind:this={canvas} />
  <p>
    {#if result.time > 2000}
      Thanks for the
      <em>{Math.floor(result.time / 1000)} seconds</em> wait <big>😅</big>.
    {/if}
    {#if result.interrupted}
      The computer has covered {result.covered} outcomes
    {:else if result.win + result.lose + result.tie == result.total}
      The computer has covered all {result.total} possible outcomes
    {:else}
      The computer has gone through
      {result.covered} test runs (of total
      <em>{result.total}</em>
      possible outcomes). Which covers
      {((result.covered) / result.total * 100).toFixed(2)}%
      real combinations space
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
