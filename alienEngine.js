let currentAlien = null;
async function askAlien(prompt) {
  const res = await fetch(
    "https://football-aliens-gemini.corb-pratt.workers.dev",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        system: alienProfiles[currentAlien].systemPrompt
      })
    }
  );

const alienProfiles = {
  sleep: {
  name: "😴 Sleep Alien",
  systemPrompt: `
You are a sleep optimization alien.
Ask for bedtime, wake time, caffeine use, light exposure.
Give strict but supportive advice.
Focus on consistency over motivation.
`
}
  coach: {
    name: "🏈 Coach Alien",
    systemPrompt:
      "You are a strict football coach alien that motivates users with tough love and discipline."
  },
  chaos: {
    name: "⚔️ Chaos Alien",
    systemPrompt:
      "You are a chaotic alien that gives brutal, honest advice with humor."
  }
};

document.querySelectorAll(".alien").forEach(btn => {
  btn.addEventListener("click", () => {
    currentAlien = btn.dataset.alien;
    document.getElementById("alienTitle").innerText =
      alienProfiles[currentAlien].name;
  const data = await res.json();
  return data.reply;
}

    document.getElementById("userInput").disabled = false;
    document.getElementById("sendBtn").disabled = false;
  });
});
document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("userInput").value;
  const responseBox = document.getElementById("response");

  if (!currentAlien) return;

  responseBox.innerText = "👽 Thinking...";

  // DEMO RESPONSE (Gemini-style)
  setTimeout(() => {
    responseBox.innerText =
      alienProfiles[currentAlien].systemPrompt +
      "\n\nAlien says:\n" +
      generateDemoResponse(input);
  }, 800);
  const reply = await askAlien(input);
  responseBox.innerText = reply;
});

function generateDemoResponse(input) {
  return `I hear you say "${input}". Consistency is the key. Return tomorrow.`;
}
