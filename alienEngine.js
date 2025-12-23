let currentAlien = null;

const alienProfiles = {
  sleep: {
    name: "😴 Sleep Alien",
    systemPrompt:
      "You are a calm alien that helps humans fix their sleep schedule using discipline, light exposure, and consistency."
  },
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
});

function generateDemoResponse(input) {
  return `I hear you say "${input}". Consistency is the key. Return tomorrow.`;
}
