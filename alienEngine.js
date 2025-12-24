document.addEventListener("DOMContentLoaded", () => {
  // ==============================
// 7 DAY FREE TRIAL
// ==============================

const TRIAL_DAYS = 7;
const TRIAL_KEY = "footballAliensTrialStart";

const now = Date.now();
let trialStart = localStorage.getItem(TRIAL_KEY);

if (!trialStart) {
  localStorage.setItem(TRIAL_KEY, now);
  trialStart = now;
}

const trialElapsedDays =
  (now - trialStart) / (1000 * 60 * 60 * 24);

const trialExpired = trialElapsedDays >= TRIAL_DAYS;
  // ==============================
  // CONFIG
  // ==============================
  const GEMINI_PROXY_URL =
    "https://football-aliens-gemini.corb-pratt.workers.dev"; 
  // ⬆️ REPLACE with your real Cloudflare Worker URL

  // ==============================
  // STATE
  // ==============================
  let currentAlien = null;

  // ==============================
  // ALIEN DEFINITIONS
  // ==============================
  const alienProfiles = {
    sleep: {
      name: "😴 Sleep Alien",
      systemPrompt: `
You are a sleep optimization alien.
You help humans fix their sleep schedule using:
- consistent wake times
- light exposure
- caffeine timing
- discipline over motivation
Be calm, direct, and practical.
`
    },
    coach: {
      name: "🏈 Coach Alien",
      systemPrompt: `
You are a strict football coach alien.
You motivate with tough love, structure, and discipline.
Short, sharp responses. No excuses.
`
    },
    chaos: {
      name: "⚔️ Chaos Alien",
      systemPrompt: `
You are a chaotic alien.
You give brutally honest advice with humor.
You challenge weak thinking aggressively but intelligently.
`
    }
  };

  // ==============================
  // DOM ELEMENTS (SAFE)
  // ==============================
  const alienButtons = document.querySelectorAll(".alien");
  const alienTitle = document.getElementById("alienTitle");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const responseBox = document.getElementById("response");

  // ==============================
  // ALIEN SELECTION
  // ==============================
  alienButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.alien;
      if (!alienProfiles[selected]) return;

      currentAlien = selected;

      if (alienTitle) {
        alienTitle.innerText = alienProfiles[selected].name;
      }

      if (userInput) userInput.disabled = false;
      if (sendBtn) sendBtn.disabled = false;

      if (responseBox) {
        responseBox.innerText =
          "👽 Alien connected. Speak.";
      }
    });
  });

  // ==============================
  // SEND MESSAGE
  // ==============================
  if (sendBtn) {
    sendBtn.addEventListener("click", async () => {
      if (!currentAlien) {
        responseBox.innerText = "Select an alien first.";
        return;
      }

      // Token gate check (from wallet.js)
      if (document.body.classList.contains("locked")) {
        responseBox.innerText =
          "🔒 Hold 420 FBA tokens to continue using this alien.";
        return;
      }

      const message = userInput.value.trim();
      if (!message) return;

      responseBox.innerText = "👽 Thinking...";
      userInput.value = "";

      try {
        const reply = await askAlien(
          message,
          alienProfiles[currentAlien].systemPrompt
        );

        responseBox.innerText = reply;
      } catch (err) {
        console.error(err);
        responseBox.innerText =
          "⚠️ Alien transmission failed.";
      }
    });
  }

  // ==============================
  // GEMINI PROXY CALL
  // ==============================
  async function askAlien(prompt, systemPrompt) {
    const res = await fetch(GEMINI_PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        system: systemPrompt
      })
    });

    if (!res.ok) {
      throw new Error("Gemini proxy error");
    }

    const data = await res.json();
    return data.reply || "👽 ...";
  }
});
