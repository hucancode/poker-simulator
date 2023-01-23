<script>
  let className;
  export { className as class };
</script>

<span class={className}>👋</span>

<style lang="postcss">
  span {
    @apply inline-block origin-[70%_70%] animate-waving-hand;
  }
</style>
