<script>
  export let value = 0.25;
  export let max = 1.0;
</script>

<progress {value} {max} />

<style>
  progress {
    @apply relative w-full overflow-hidden rounded-full;
  }
  progress::-webkit-progress-bar {
    @apply bg-gray-200;
  }
  progress::-webkit-progress-value {
    @apply bg-blue-400;
  }
  progress::-webkit-progress-bar,
  progress::-webkit-progress-value {
    @apply duration-500;
  }
  progress:not([max])::after {
    @apply absolute inset-0 w-1/4 animate-pingpong bg-blue-400 content-[''];
  }
</style>
