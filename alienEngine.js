// alienEngine.js — Football Aliens AI Engine

const PROXY_URL =
  "https://football-aliens-proxy-67re77820-runnerzs-projects.vercel.app/api/alien";

let selectedAlien = "Zorg";

// UI elements
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const output = document.getElementById("messages");
const status = document.getElementById("status");

// Alien selector buttons
document.querySelectorAll(".alien-btn").forEach((btn) => {
  btn.onclick = () => {
    selectedAlien = btn.dataset.alien;

    document.querySelectorAll(".alien-btn").forEach(b =>
      b.classList.remove("active")
    );
    btn.classList.add("active");

    console.log("👽 Selected alien:", selectedAlien);
  };
});

// Talk to alien
async function talkToAlien(message) {
  try {
    status.innerText = "📡 Contacting alien...";
    console.log("📡 Sending:", { alien: selectedAlien, message });

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

// Send message
sendBtn.onclick = async () => {
  const message = input.value.trim();
  if (!message) return;

  input.value = "";
  output.innerText = "👽 Thinking...";

  const reply = await talkToAlien(message);

  output.innerText = `🧑 You: ${message}\n\n👽 ${selectedAlien}: ${reply}`;
  status.innerText = "✅ Connected";
};

// Optional: send on Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});
