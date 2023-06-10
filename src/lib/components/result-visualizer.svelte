<script>
  import ResultSingle from "$lib/components/result-single.svelte";
  import ResultMulti from "$lib/components/result-multi.svelte";
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
  <h3>This is an invalid board. No computation has been made</h3>
{:else if result.total == 1}
  <ResultSingle {result} />
{:else}
  <ResultMulti {result} />
{/if}
