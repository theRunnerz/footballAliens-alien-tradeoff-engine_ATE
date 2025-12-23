<script>
  import AlienSelector from '$lib/AlienSelector.svelte';
  import AlienCard from '$lib/AlienCard.svelte';

  let context = '';
  let alien = 'default';
  let result = null;
  let loading = false;

  async function askAlien() {
    loading = true;
    result = null;

    const res = await fetch('/api/ask-alien', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, alien })
    });

    result = await res.json();
    loading = false;
  }
</script>

<div class="container">
  <h1>👽 Football Aliens</h1>
  <p class="subtitle">Alien Tradeoff Engine</p>

  <AlienSelector bind:alien />

  <textarea
    placeholder="Describe your situation… (sleep, habits, distractions, decisions)"
    bind:value={context}
  />

  <button on:click={askAlien} disabled={loading || !context}>
    {loading ? 'Analyzing…' : 'Ask the Alien'}
  </button>

  {#if result}
    <AlienCard {result} />
  {/if}
</div>

<style>
  .container {
    width: 100%;
    max-width: 480px;
    background: rgba(5, 8, 15, 0.9);
    padding: 1.5rem;
    border-radius: 20px;
    border: 1px solid #1aff64;
  }

  h1 {
    text-align: center;
    margin-bottom: 0.2rem;
  }

  .subtitle {
    text-align: center;
    opacity: 0.7;
    margin-bottom: 1rem;
  }

  textarea {
    width: 100%;
    min-height: 120px;
    background: #02030a;
    color: #eafff1;
    border: 1px solid #1aff64;
    border-radius: 12px;
    padding: 0.8rem;
    margin-bottom: 1rem;
  }

  button {
    width: 100%;
    padding: 0.9rem;
    border-radius: 12px;
    background: #1aff64;
    border: none;
    font-weight: bold;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
