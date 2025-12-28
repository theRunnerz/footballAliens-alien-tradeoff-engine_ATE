// alienEngine.js — Football Aliens AI Engine
const PROXY_URL =
  "https://football-aliens-proxy-cidq0bs3d-runnerzs-projects.vercel.app/api/alien";

let selectedAlien = "Zorg";

// Alien selector buttons
document.querySelectorAll(".alien-btn").forEach((btn) => {
  btn.onclick = () => {
    selectedAlien = btn.dataset.alien;
    console.log("👽 Selected alien:", selectedAlien);
  };
});

// Talk to alien
async function talkToAlien(message) {
  try {
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        alien: selectedAlien,
      }),
    });

    const data = await res.json();

    if (!data.reply) {
      throw new Error("No reply from alien");
    }

    return data.reply;
  } catch (err) {
    console.error("❌ Talk error:", err);
    return "👽 Transmission failed. Try again.";
  }
}

// UI hookup
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("alienInput");
const output = document.getElementById("alienOutput");

sendBtn.onclick = async () => {
  const message = input.value.trim();
  if (!message) return;

  output.innerText = "👽 Thinking...";
  const reply = await talkToAlien(message);
  output.innerText = reply;
};

