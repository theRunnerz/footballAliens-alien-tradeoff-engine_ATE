<svelte:head>
  <title>Football Aliens 👽</title>
</svelte:head>

<div class="app">
  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
    background: radial-gradient(circle at top, #0b1020, #02030a);
    color: #eafff1;
    font-family: system-ui, -apple-system, BlinkMacSystemFont;
  }

  .app {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
</style>
