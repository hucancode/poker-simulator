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
  };
  let canvas;
  onMount(() => {
    Chart.register(PieController, ArcElement, Colors, Legend, Tooltip);
    let chart = new Chart(canvas, {
      type: "pie",
      data: {
        labels: ["Win", "Tie", "Lose"],
        datasets: [
          {
            data: [result.win, result.tie, result.lose],
            backgroundColor: [
              "rgb(255, 205, 86)",
              "rgb(54, 162, 235)",
              "rgb(255, 99, 132)",
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                size: 20,
              },
            },
          },
        },
      },
    });
    return () => {
      chart.destroy();
      chart = null;
    };
  });
</script>

<canvas class="mx-auto max-w-xs p-8" bind:this={canvas} />
<small class="leading-tight">
  {#if result.time > 2000}
    In the matter of
    <em>{Math.floor(result.time / 1000)} seconds</em>,
  {/if}
  I have fast-forwarded into the future and saw
  {#if result.interrupted}
    <em>{result.covered}</em>
  {:else if result.covered == result.total}
    all <em>{result.total}</em> possible
  {:else}
    <em>
      {result.covered}/{result.total}
      ({((result.covered / result.total) * 100).toFixed(2)}%)
    </em>
  {/if}
  outcomes, <em>{result.win}</em> of that you win
</small>
