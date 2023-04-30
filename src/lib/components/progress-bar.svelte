<script>
  export let value = 0.6;
  export let max = 1.0;
  export let indeterminate = false;
</script>

<progress
  {value}
  {max}
  class="relative w-full overflow-hidden rounded-full"
  {indeterminate}
/>

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
  progress[indeterminate="true"]::after {
    content: "";
    inset: 0;
    position: absolute;
    background: linear-gradient(
      to right,
      #e5e7eb 45%,
      #60a5fa 0%,
      #60a5fa 55%,
      #e5e7eb 0%
    );
    background-size: 225% 100%;
    background-position: right;
    animation: progress-loading 2s infinite ease;
  }
  @keyframes progress-loading {
    50% {
      background-position: left;
    }
  }
</style>
