<script>
  export let result = {
    iterations: 0,
    heroWin: 0,
    heroTie: 0,
    heroLose: 0,
    villainEquity: [],
    time: 0,
  };

  $: heroEquity = result.heroWin + result.heroTie / 2;
  $: villainCount = result.villainEquity.length;
</script>

<div class="wrap">
  <div class="hero-block">
    <div class="hero-headline">Your equity</div>
    <div class="hero-value">{(heroEquity * 100).toFixed(2)}%</div>
  </div>

  <div class="bar three-seg" aria-label="Hero outcomes">
    <div
      class="seg win"
      style="flex: {result.heroWin};"
      title="Win {(result.heroWin * 100).toFixed(0)}%"
    >
      {#if result.heroWin > 0.2}
        <span>Win {(result.heroWin * 100).toFixed(0)}%</span>
      {/if}
    </div>
    <div
      class="seg tie"
      style="flex: {result.heroTie};"
      title="Tie {(result.heroTie * 100).toFixed(0)}%"
    >
      {#if result.heroTie > 0.2}
        <span>Tie {(result.heroTie * 100).toFixed(0)}%</span>
      {/if}
    </div>
    <div
      class="seg lose"
      style="flex: {result.heroLose};"
      title="Lose {(result.heroLose * 100).toFixed(2)}%"
    >
      {#if result.heroLose > 0.2}
        <span>Lose {(result.heroLose * 100).toFixed(0)}%</span>
      {/if}
    </div>
  </div>

  {#if villainCount > 0}
    <div class="villains">
      <div class="vil-head">Villain equity</div>
      {#each result.villainEquity as eq, i}
        <div class="vil-row">
          <span class="vil-name">V{i + 1}</span>
          <div class="vil-bar">
            <div class="vil-fill" style="width: {eq * 100}%"></div>
          </div>
          <span class="vil-pct">{(eq * 100).toFixed(2)}%</span>
        </div>
      {/each}
    </div>
  {/if}

  <small class="caption">
    {#if result.time > 2000}
      In the matter of
      <em>{Math.floor(result.time / 1000)} seconds</em>,
    {/if}
    I have fast-forwarded into the future and saw
    <em>{result.iterations.toLocaleString()}</em>
    outcomes,
    <em>{Math.round(result.heroWin * result.iterations).toLocaleString()}</em>
    of that you win
  </small>
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    width: 100%;
    max-width: 28rem;
    margin: 0 auto;
  }
  .hero-block {
    text-align: center;
  }
  .hero-headline {
    font-size: 0.875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .hero-value {
    font-size: 2.5rem;
    font-weight: 800;
    font-family: ui-monospace, monospace;
    line-height: 1.1;
  }
  .bar {
    display: flex;
    width: 100%;
    height: 1.75rem;
    overflow: hidden;
  }
  .seg {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
  }
  .seg.win {
    background: #16a34a;
  }
  .seg.tie {
    background: #2563eb;
  }
  .seg.lose {
    background: #dc2626;
  }
  .villains {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .vil-head {
    font-size: 0.875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
    margin-top: 0.5rem;
  }
  .vil-row {
    display: grid;
    grid-template-columns: 2rem 1fr 3.5rem;
    align-items: center;
    gap: 0.5rem;
  }
  .vil-name {
    font-weight: 700;
    font-family: ui-monospace, monospace;
  }
  .vil-bar {
    background: #e5e7eb;
    height: 0.625rem;
    overflow: hidden;
  }
  .vil-fill {
    height: 100%;
    background: #f97316;
    transition: width 200ms;
  }
  .vil-pct {
    text-align: right;
    font-family: ui-monospace, monospace;
    font-size: 0.875rem;
  }
  .caption {
    color: #6b7280;
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.5;
    margin-top: 0.5rem;
  }
  .caption em {
    font-style: italic;
    font-weight: 600;
  }
</style>
