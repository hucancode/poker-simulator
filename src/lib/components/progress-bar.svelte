<script>
  export let value = 0.6;
  export let max = 1.0;
</script>

<progress {value} {max} class="w-full overflow-hidden rounded-full" />

<style>
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
</style>
