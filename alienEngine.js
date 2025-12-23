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
