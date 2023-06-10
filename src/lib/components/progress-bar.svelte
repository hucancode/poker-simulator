<script>
  export let value;
  export let max;
</script>

{#if max}
  <progress {max} {value} />
{:else}
  <progress />
{/if}

<style>
  progress {
    @apply relative w-full overflow-hidden rounded-full;
  }
  progress::-webkit-progress-bar {
    @apply bg-gray-200;
  }
  progress::-webkit-progress-value,
  progress::-moz-progress-bar {
    @apply bg-blue-400;
  }
  progress::-webkit-progress-bar,
  progress::-webkit-progress-value,
  progress::-moz-progress-bar {
    @apply duration-500;
  }
  progress:not([max])::after {
    @apply absolute inset-0 w-1/4 animate-pingpong bg-blue-400 content-[''];
  }
  progress:indeterminate::-moz-progress-bar {
    @apply absolute inset-0 w-1/4 animate-pingpong-absolute bg-blue-400;
  }
</style>
