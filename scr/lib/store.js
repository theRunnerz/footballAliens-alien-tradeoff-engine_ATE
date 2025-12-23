import { writable } from 'svelte/store';

function persistent(key, initial) {
  const stored = localStorage.getItem(key);
  const store = writable(stored ? JSON.parse(stored) : initial);

  store.subscribe(value => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  return store;
}

export const memory = persistent('alien-memory', []);
export const streak = persistent('alien-streak', 0);
