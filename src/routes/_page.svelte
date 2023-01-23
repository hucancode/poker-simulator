<script context="module">
  export const prerender = true;
</script>

<script>
  import WavingHand from "$lib/components/waving-hand.svelte";
  import { _ } from "svelte-i18n";
</script>

<svelte:head>
  <title>SvelteKit</title>
</svelte:head>
<div
  class="flex-col-center h-screen 
	w-screen gap-7 bg-gray-100 text-black
	dark:bg-gray-800 dark:text-white"
>
  <WavingHand class="text-7xl" />
  <div class="flex-col-center text-center">
    <h1 class="welcome">
      {@html $_("welcome")}
    </h1>
    <p class="help-text">
      {@html $_("help-text")}
    </p>
  </div>
</div>

<style lang="postcss" global>
  .welcome {
    @apply text-4xl font-bold;
    span {
      @apply mr-3 font-logo-cursive;
    }
  }
  .help-text {
    @apply font-thin;
    a {
      @apply hover:text-blue-500;
    }
  }
</style>
