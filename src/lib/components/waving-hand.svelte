<span><slot>👋</slot></span>

<style>
  span {
    display: inline-block;
    transform-origin: 70% 70%;
    user-select: none;
  }
  span:hover {
    animation: waving-hand 2.5s infinite;
  }
  @keyframes waving-hand {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(20deg);
    }
    20% {
      transform: rotate(-10deg);
    }
    30% {
      transform: rotate(10deg);
    }
    40% {
      transform: rotate(-10deg);
    }
    50% {
      transform: rotate(0deg);
    }
  }
</style>
