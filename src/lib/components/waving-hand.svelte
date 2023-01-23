<script>
  let className;
  export { className as class };
</script>

<span class={className}><slot>👋</slot></span>

<style lang="postcss">
  span {
    @apply inline-block origin-[70%_70%] select-none hover:animate-waving-hand;
  }
</style>
