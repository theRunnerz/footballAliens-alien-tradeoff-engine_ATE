// alienEngine.js v4.3.0
console.log("👽 Alien Engine loaded");

const PROXY_URL =
  "https://football-aliens-proxy-nwa6x9nrf-runnerzs-projects.vercel.app/api/alien";

let selectedAlien = "Zorg";

// -------------------------
// Alien selection
// -------------------------
document.querySelectorAll(".alien-card").forEach((card) => {
  card.addEventListener("click", () => {
    selectedAlien = card.dataset.alien;
    console.log("👽 Selected alien:", selectedAlien);

    document.querySelectorAll(".alien-card").forEach((c) =>
      c.classList.remove("selected")
    );
    card.classList.add("selected");
  });
});

// -------------------------
// Talk to alien
// -------------------------
async function talkToAlien(message) {
  console.log("🛸 Talking to alien:", selectedAlien);

  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        alien: selectedAlien,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("👽 Alien reply:", data.reply);

    return data.reply || "👽 Alien is silent…";
  } catch (err) {
    console.error("❌ Alien talk failed:", err);
    return "👽 Signal lost in deep space…";
  }
}

// -------------------------
// UI wiring
// -------------------------
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("alienInput");
const output = document.getElementById("alienOutput");

sendBtn.onclick = async () => {
  const message = input.value.trim();
  if (!message) return;

  output.textContent = "🧠 Thinking...";
  input.value = "";

  const reply = await talkToAlien(message);
  output.textContent = reply;
};
