<script>
  export let value;
  export let max;
</script>

{#if max}
  <progress {max} {value}></progress>
{:else}
  <progress></progress>
{/if}

<style>
  progress {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 9999px;
    height: 0.75rem;
    border: none;
    appearance: none;
  }
  progress::-webkit-progress-bar {
    background-color: #e5e7eb;
  }
  progress::-webkit-progress-value,
  progress::-moz-progress-bar {
    background-color: #60a5fa;
  }
  progress::-webkit-progress-bar,
  progress::-webkit-progress-value,
  progress::-moz-progress-bar {
    transition: all 500ms;
  }
  progress:not([max])::after {
    position: absolute;
    inset: 0;
    width: 25%;
    background-color: #60a5fa;
    content: "";
    animation: pingpong 1s infinite alternate ease-in-out;
  }
  progress:indeterminate::-moz-progress-bar {
    position: absolute;
    inset: 0;
    width: 25%;
    background-color: #60a5fa;
    animation: pingpong-absolute 1s infinite alternate ease-in-out;
  }
  @keyframes pingpong {
    from {
      left: -25%;
    }
    to {
      left: 100%;
    }
  }
  @keyframes pingpong-absolute {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(400%);
    }
  }
</style>
